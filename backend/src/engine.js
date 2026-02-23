/**
 * OWASP Reasoner - İleri Zincirleme (Forward Chaining) Çıkarım Motoru
 * Issue #1: Proje Vizyonu ve Mimari Tasarım
 * 
 * Mimari:
 *  - Knowledge Acquisition → OWASP docs → rules.json
 *  - Knowledge Representation → Ağaç / Kural tabanlı model
 *  - Knowledge Base → rules.json
 *  - Inference Mechanism → Forward Chaining (ileri zincirleme)
 *  - Expert System → Bu dosya
 */

const fs = require('fs');
const path = require('path');

class OWASPInferenceEngine {
    constructor() {
        const rulesPath = path.join(__dirname, '../knowledge-base/rules.json');
        const raw = fs.readFileSync(rulesPath, 'utf-8');
        this.knowledgeBase = JSON.parse(raw);
        this.factMemory = {}; // Çalışma belleği: toplanan gerçekler
    }

    /**
     * Tüm soruları kategori ve kural tipi bazında döndürür.
     * Her soru benzersiz ID'ye ve metadata'ya sahiptir.
     */
    getAllQuestions() {
        const questions = [];
        for (const category of this.knowledgeBase.categories) {
            for (const type of category.types) {
                for (const indicator of type.indicators) {
                    questions.push({
                        id: indicator.id,
                        question: indicator.question,
                        symptom: indicator.symptom,
                        categoryId: category.id,
                        categoryName: category.name,
                        typeId: type.id,
                        typeName: type.name,
                        weight: indicator.weight,
                        inverse: indicator.inverse || false
                    });
                }
            }
        }
        return questions;
    }

    /**
     * Forward Chaining (İleri Zincirleme) Motoru
     * 
     * Adım 1: Gerçekleri toplama (Fact Gathering) - answers{questionId: bool}
     * Adım 2: Kuralları işletme (Rule Evaluation) - her kural tipi için threshold hesapla
     * Adım 3: Çıkarım yapma (Inference) - OWASP kategorisi sınıflandırması
     * 
     * @param {Object} answers - {questionId: boolean} formatında cevaplar
     * @returns {Object} Çıkarım sonuçları
     */
    reason(answers) {
        // Adım 1: Çalışma belleğini gerçeklerle doldur
        this.factMemory = { ...answers };

        const inferences = [];
        const detectedCategories = new Set();

        // Adım 2 ve 3: Kural değerlendirme ve çıkarım
        for (const category of this.knowledgeBase.categories) {
            const categoryResult = {
                categoryId: category.id,
                categoryName: category.name,
                severity: category.severity,
                description: category.description,
                detectedTypes: [],
                totalScore: 0
            };

            for (const type of category.types) {
                const typeResult = this._evaluateRule(type, answers);

                if (typeResult.triggered) {
                    categoryResult.detectedTypes.push(typeResult);
                    categoryResult.totalScore += typeResult.score;
                    detectedCategories.add(category.id);
                }
            }

            if (categoryResult.detectedTypes.length > 0) {
                inferences.push(categoryResult);
            }
        }

        // Çıkarım ağacı: En kritik bulguları öne çıkar
        const ranked = inferences.sort((a, b) => {
            const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
            const sevDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
            if (sevDiff !== 0) return sevDiff;
            return b.totalScore - a.totalScore;
        });

        return {
            timestamp: new Date().toISOString(),
            summary: this._buildSummary(ranked),
            findings: ranked,
            safeCategories: this._getSafeCategories(detectedCategories),
            riskLevel: this._calculateOverallRisk(ranked),
            totalAnswered: Object.keys(answers).length
        };
    }

    /**
     * Tek bir kural tipini değerlendirir (ağacın "ince dalı")
     * EĞER (belirtiler toplamı >= threshold) O ZAMAN (zafiyet tespit edildi)
     */
    _evaluateRule(type, answers) {
        let score = 0;
        const triggeredIndicators = [];
        const negativeIndicators = [];

        for (const indicator of type.indicators) {
            const answer = answers[indicator.id];
            if (answer === undefined) continue; // Cevapsız atla

            const isVulnerable = indicator.inverse ? !answer : answer;

            if (isVulnerable) {
                score += indicator.weight;
                triggeredIndicators.push({
                    id: indicator.id,
                    symptom: indicator.symptom,
                    question: indicator.question,
                    weight: indicator.weight
                });
            } else {
                negativeIndicators.push({
                    id: indicator.id,
                    symptom: indicator.symptom
                });
            }
        }

        const triggered = score >= type.threshold;

        return {
            typeId: type.id,
            typeName: type.name,
            cwe: type.cwe,
            triggered,
            score,
            threshold: type.threshold,
            triggeredIndicators,
            negativeIndicators,
            remediation: triggered ? type.remediation : [],
            references: triggered ? type.references : []
        };
    }

    _buildSummary(findings) {
        if (findings.length === 0) {
            return 'Tespit edilen zafiyet bulunamadı. Ancak bu, uygulamanın tamamen güvenli olduğu anlamına gelmez.';
        }
        const critical = findings.filter(f => f.severity === 'critical').length;
        const high = findings.filter(f => f.severity === 'high').length;
        const totalTypes = findings.reduce((acc, f) => acc + f.detectedTypes.length, 0);
        return `${findings.length} OWASP kategorisinde ${totalTypes} zafiyet tipi tespit edildi (${critical} kritik, ${high} yüksek).`;
    }

    _getSafeCategories(detectedIds) {
        return this.knowledgeBase.categories
            .filter(c => !detectedIds.has(c.id))
            .map(c => ({ categoryId: c.id, categoryName: c.name }));
    }

    _calculateOverallRisk(findings) {
        if (findings.length === 0) return 'low';
        if (findings.some(f => f.severity === 'critical')) return 'critical';
        if (findings.some(f => f.severity === 'high')) return 'high';
        return 'medium';
    }

    /**
     * Tüm knowledge base meta verilerini döndürür (frontend için)
     */
    getKnowledgeBaseInfo() {
        return {
            version: this.knowledgeBase.version,
            totalCategories: this.knowledgeBase.categories.length,
            totalRuleTypes: this.knowledgeBase.categories.reduce((acc, c) => acc + c.types.length, 0),
            totalIndicators: this.getAllQuestions().length,
            categories: this.knowledgeBase.categories.map(c => ({
                id: c.id,
                name: c.name,
                severity: c.severity,
                description: c.description,
                typeCount: c.types.length
            }))
        };
    }
}

module.exports = OWASPInferenceEngine;
