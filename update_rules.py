import json
import os

data_path = r'c:\Users\MOAyman\Desktop\project\OWASP-Reasoner\backend\knowledge-base\rules.json'

with open(data_path, 'r', encoding='utf-8') as f:
    rules = json.load(f)

s_mapping = {
    # 1. SQL Injection (A03:2021 / R-SQLI-01)
    "A03_SQLi": [
        {"id": "S1", "question": "Kullanıcı, arama kutusuna ' OR 1=1 -- yazarak tüm veritabanı kayıtlarına erişebilmektedir.", "symptom": "Boolean SQLi (Veri İfşası)", "weight": 3},
        {"id": "S2", "question": "Hata sayfasında SQL sözdizimi hatası ve tablo/sütun isimleri kullanıcıya gösterilmektedir.", "symptom": "Hata Tabanlı SQL Yanıtı", "weight": 3},
        {"id": "S3", "question": "SQL sorguları, kullanıcıdan gelen metin doğrudan eklenerek (+ ile birleştirilerek) oluşturulmaktadır.", "symptom": "String Concatenation ile SQL Oluşturma", "weight": 3},
        {"id": "S4", "question": "Kodun hiçbir yerinde Prepared Statement veya ORM kullanılmamaktadır.", "symptom": "Ham SQL Sorgu Kullanımı", "weight": 3},
        {"id": "S5", "question": "Sıradan bir form alanına girdi yapılarak veritabanındaki kayıtlar silinebilmektedir.", "symptom": "Veri Silme (Tahribat)", "weight": 4},
        {"id": "S6", "question": "UNION SELECT komutu kullanılarak kullanıcıların şifre hash'leri elde edilebilmektedir.", "symptom": "Veri Sızıntısı (UNION SQLi)", "weight": 4},
        {"id": "S7", "question": "Veritabanı hesabı admin yetkisine sahiptir; en düşük yetki prensibi uygulanmamaktadır.", "symptom": "Aşırı Yetkilendirme", "weight": 3}
    ],
    # 2. Broken Access Control & IDOR (A01:2021 / R-IDOR-01)
    "A01_BAC": [
        {"id": "S8", "question": "URL'deki id=42 değeri id=43 olarak değiştirildiğinde başka bir kullanıcının verileri görüntülenebilmektedir.", "symptom": "Tahmin Edilebilir ve İstismar Edilen IDOR", "weight": 4},
        {"id": "S9", "question": "Başka bir kullanıcıya ait dosya (fatura, rapor), dosya URL'si bilindiğinde herhangi biri tarafından indirilebilmektedir.", "symptom": "Dosya Bazlı IDOR", "weight": 4},
        {"id": "S10", "question": "Giriş yapılmadan /admin veya /dashboard sayfasının URL'si yazılarak yönetim paneline erişilebilmektedir.", "symptom": "Kimlik Doğrulama Atlatma (Forced Browsing)", "weight": 4},
        {"id": "S11", "question": "Sunucu, bir kaydı güncellemeden önce o kaydın gerçekten oturum açmış kullanıcıya ait olup olmadığını doğrulamamaktadır.", "symptom": "Sunucu Taraflı Sahiplik Kontrolü Eksikliği", "weight": 3},
        {"id": "S12", "question": "Arayüz yalnızca butonları CSS ile gizlemekte, ancak sunucu tarafında herhangi bir yetki kontrolü yapılmamaktadır.", "symptom": "İstemci Taraflı Yetkilendirme (Güvensiz)", "weight": 3},
        {"id": "S13", "question": "Fatura numarası tahmin edilerek URL üzerinden başkasının faturasına ulaşılabilmektedir.", "symptom": "Tahmin Edilebilir İndeks", "weight": 3},
        {"id": "S14", "question": "/backup/db_export.sql gibi yedek dosyalara internet üzerinden herhangi biri erişebilmektedir.", "symptom": "Hassas Sayfa/Dosya Açığa Çıkması", "weight": 4}
    ],
    # 3. XSS (A03:2021 / R-XSS-01)
    "A03_XSS": [
        {"id": "S15", "question": "Yorum alanına <script>alert('XSS')</script> yazıldığında bu kod diğer ziyaretçilerin tarayıcısında çalışmaktadır.", "symptom": "Stored (Kalıcı) XSS", "weight": 4},
        {"id": "S16", "question": "Arama sonuç sayfası, aranan kelimeyi HTML encode etmeden doğrudan sayfaya yansıtmaktadır.", "symptom": "Çıktı Kodlaması Eksikliği", "weight": 3},
        {"id": "S17", "question": "Saldırgan, XSS açığı sayesinde başka bir kullanıcının oturum çerezini (session cookie) çalabilmektedir.", "symptom": "Session Çalma (Oturum Devri)", "weight": 4},
        {"id": "S18", "question": "Sitede herhangi bir Content-Security-Policy (CSP) HTTP başlığı bulunmamaktadır.", "symptom": "CSP Eksikliği", "weight": 2, "inverse": True},
        {"id": "S19", "question": "Profil sayfasındaki 'Ad Soyad' alanı HTML içeriği kabul etmekte ve olduğu gibi görüntülemektedir.", "symptom": "HTML Filtresiz Giriş", "weight": 3},
        {"id": "S20", "question": "Arama sonuçları sayfası <img onerror=...> gibi zararlı etiketleri filtrelemeden göstermektedir.", "symptom": "Etiket Filtresi Aşımı", "weight": 3},
        {"id": "S21", "question": "Saldırgan, XSS açığı aracılığıyla kullanıcıları kimlik avı (phishing) sitesine yönlendirebilmektedir.", "symptom": "Zararlı Yönlendirme (XSS)", "weight": 4}
    ],
    # 4. Identification & Authentication Failures (A07:2021)
    "A07_Auth": [
        {"id": "S22", "question": "Giriş sayfasına herhangi bir kısıtlama olmaksızın binlerce parola denemesi yapılabilmektedir (Brute-Force).", "symptom": "Brute-Force Koruması Eksikliği", "weight": 3},
        {"id": "S23", "question": "Sistem 123456, password veya qwerty gibi son derece basit şifreleri kabul etmektedir.", "symptom": "Zayıf Şifre Politikası", "weight": 3},
        {"id": "S24", "question": "Çok faktörlü kimlik doğrulama (MFA / 2FA) seçeneği hiç sunulmamaktadır.", "symptom": "MFA Bulunmaması", "weight": 2},
        {"id": "S25", "question": "Şifre sıfırlama bağlantısı 7 gün boyunca geçerliliğini korumaktadır (Kısa ömürlü değil).", "symptom": "Uzun Ömürlü Kurtarma Token'ı", "weight": 3},
        {"id": "S26", "question": "Kullanıcı giriş yaptıktan sonra oturum kimliği (Session ID) değişmemektedir (Session Fixation).", "symptom": "Giriş Sonrası Session ID Sabitliği", "weight": 4},
        {"id": "S27", "question": "Önceden belirlenmiş bir Session ID, URL parametresi olarak (?SESSID=abc123) sisteme enjekte edilebilmektedir.", "symptom": "URL Tabanlı Session Enjeksiyonu", "weight": 3},
        {"id": "S28", "question": "Hesap kurtarma için 'Annenizin kızlık soyadı?' gibi kolayca tahmin edilebilir güvenlik soruları kullanılmaktadır.", "symptom": "Zayıf Güvenlik Sorusu (KBA)", "weight": 3}
    ],
    # 5. Security Misconfiguration (A05:2021)
    "A05_Misconfig": [
        {"id": "S29", "question": "Bir hata oluştuğunda sayfada Stack Trace ve dahili dosya yolları görüntülenmektedir.", "symptom": "Fazla Bilgi Açıklama (Stack Trace)", "weight": 3},
        {"id": "S30", "question": "Üretim ortamında Debug modu hâlâ etkin durumdadır.", "symptom": "Üretimde Debug Modu", "weight": 3},
        {"id": "S31", "question": "Varsayılan kullanıcı adı ve şifre (admin / admin) hiç değiştirilmemiştir.", "symptom": "Varsayılan Kimlik Bilgileri", "weight": 4},
        {"id": "S32", "question": "MySQL (3306), MongoDB (27017) gibi veritabanı portları internete açık durumdadır.", "symptom": "Gereksiz Servis İfşası (Port)", "weight": 4},
        {"id": "S33", "question": "Web sunucusu dizin listelemeyi (directory listing) aktif bırakarak sunucu dosya yapısını ifşa etmektedir.", "symptom": "Dizin Listeleme (Directory Listing)", "weight": 3},
        {"id": "S34", "question": "Veritabanı şifresi içeren .env dosyasına tarayıcı üzerinden erişilebilmektedir.", "symptom": "Çok Kritik Dosya İfşası (.env)", "weight": 4},
        {"id": "S35", "question": "Kullanılan kütüphaneler (Libraries) ve bileşenler bilinen güvenlik açıkları içermesine rağmen güncellenmemektedir.", "symptom": "Güncel Olmayan Bileşen (Zafiyetli)", "weight": 3}
    ]
}

new_categories = []
for category in rules['categories']:
    cat_id = category['id']
    if cat_id == 'A01:2021':
        all_rems = []
        all_refs = []
        for t in category['types']:
            all_rems.extend(t.get('remediation', []))
            all_refs.extend(t.get('references', []))
        
        category['types'] = [{
            "id": "R-BAC-01",
            "name": "Erişim Kontrolü Hataları (Broken Access Control & IDOR)",
            "cwe": "CWE-285",
            "description": "Yetki kontrollerinin sunucu tarafında eksik yapılması ve korumalı kaynaklara yetkisiz erişim sağlanması.",
            "indicators": s_mapping["A01_BAC"],
            "threshold": 12,
            "owasp_ref": "A01:2021",
            "remediation": list(set(all_rems)),
            "references": list(set(all_refs))
        }]
    elif cat_id == 'A03:2021':
        all_rems = []
        all_refs = []
        for t in category['types']:
            if 'SQL' in t['name']:
                all_rems.extend(t.get('remediation', []))
            if 'XSS' in t['name']:
                # store separately if desired, but let's just combine for simplicity or grab existing
                pass
        
        category['types'] = [
            {
                "id": "R-SQLI-01",
                "name": "SQL Enjeksiyonu (SQL Injection - SQLi)",
                "cwe": "CWE-89",
                "description": "Kullanıcı girdilerinin doğrudan SQL sorgularına dahil edilmesi ve veritabanı üzerinde yetkisiz işlem yapılması.",
                "indicators": s_mapping["A03_SQLi"],
                "threshold": 10,
                "owasp_ref": "A03:2021",
                "remediation": [
                    "Tüm sorgularda prepared statement ve parameterized query kullanın.",
                    "Sunucu tarafında whitelist tabanlı giriş doğrulama uygulayın.",
                    "Veritabanı hesabına minimum yetki verin.",
                    "WAF ile SQL injection girişimlerini filtreleyin."
                ],
                "references": [
                    "https://owasp.org/Top10/A03_2021-Injection/"
                ]
            },
            {
                "id": "R-XSS-01",
                "name": "Siteler Arası Betik Çalıştırma (Cross-Site Scripting - XSS)",
                "cwe": "CWE-79",
                "description": "Zararlı JavaScript kodlarının tarayıcıda yürütülmesine izin verilmesi.",
                "indicators": s_mapping["A03_XSS"],
                "threshold": 10,
                "owasp_ref": "A03:2021",
                "remediation": [
                    "Tüm kullanıcı girdilerini çıktıya yazarken HTML encode edin.",
                    "Content-Security-Policy header'ı ekleyin.",
                    "Modern framework'lerin otomatik kaçırma özelliklerini kullanın (React, Angular)."
                ],
                "references": [
                    "https://owasp.org/Top10/A03_2021-Injection/"
                ]
            }
        ]
    elif cat_id == 'A07:2021':
        all_rems = []
        all_refs = []
        for t in category['types']:
            all_rems.extend(t.get('remediation', []))
            all_refs.extend(t.get('references', []))
            
        category['types'] = [{
            "id": "R-AUTH-01",
            "name": "Kimlik Doğrulama Hataları",
            "cwe": "CWE-287",
            "description": "Oturum yönetimi ve parola politikalarındaki zayıflıklar nedeniyle kimlik hırsızlığı riskleri.",
            "indicators": s_mapping["A07_Auth"],
            "threshold": 12,
            "owasp_ref": "A07:2021",
            "remediation": list(set(all_rems)),
            "references": list(set(all_refs))
        }]
    elif cat_id == 'A05:2021':
        all_rems = []
        all_refs = []
        for t in category['types']:
            all_rems.extend(t.get('remediation', []))
            all_refs.extend(t.get('references', []))
            
        category['types'] = [{
            "id": "R-MC-01",
            "name": "Güvenlik Yapılandırma Hataları",
            "cwe": "CWE-16",
            "description": "Sunucu ayarlarının hatalı bırakılması ve gereğinden fazla bilgi ifşası.",
            "indicators": s_mapping["A05_Misconfig"],
            "threshold": 12,
            "owasp_ref": "A05:2021",
            "remediation": list(set(all_rems)),
            "references": list(set(all_refs))
        }]

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(rules, f, ensure_ascii=False, indent=2)

print("Updated rules.json successfully.")
