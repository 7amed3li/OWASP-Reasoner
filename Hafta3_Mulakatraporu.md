# HAFTA 3 – UZMANDAN YAPISAL OLMAYAN MÜLAKAT İLE BİLGİNİN TEMİN EDİLMESİ

**Ders:** Uzman Sistemler  
**Görev:** Üçüncü Hafta – Yapısal Olmayan Mülakat İle Bilgi Temin Raporu  
**Tarih:** 27.02.2026

---

## 1. GİRİŞ

Bu rapor, uzman sistemler dersinin üçüncü hafta görevi kapsamında hazırlanmıştır. Görevin amacı, belirli bir alan uzmanından **yapısal olmayan mülakat (unstructured interview)** yöntemi kullanılarak bilgi temin etmek ve elde edilen bilgiyi sistematik biçimde belgelemektir.

Yapısal olmayan mülakatlar, bilgi mühendisinin konuşma akışını katı bir soru listesine bağlamadığı, uzmanın kendi bilgi yapısını ve önceliklerini özgürce ifade edebildiği bir bilgi edinme tekniğidir. Bu yöntem özellikle bir alana ilk kez girildiğinde, uzmanın zihinsel modelini anlamak ve bilinmeyen kavramları keşfetmek için tercih edilir.

### Konu Alanı
**Web Uygulama Güvenliği ve OWASP Top 10 Güvenlik Açıkları**

### Taraflar

| Rol | Kişi |
|---|---|
| **Uzman (Domain Expert)** | Hamed Mohamed – Web Güvenlik Uzmanı |
| **Bilgi Mühendisi (Knowledge Engineer)** | Furkan Yapıcı – Bilgi Mühendisi |

---

## 2. MÜLAKAT KAYDI

**Yer:** Üniversite kütüphanesi, özel çalışma odası  
**Tarih:** 02.03.2026  
**Tahmini Süre:** ~60 dakika  
---

### MÜLAKAT DİYALOĞU

---

**Furkan Yapıcı:** Hamed, bugün seninle web güvenliği üzerine konuşmak istiyorum. Bildiğim kadarıyla OWASP ile çalışıyorsun; bana bu alandan bahseder misin?

**Hamed Mohamed:** Tabii. Ben yıllardır web uygulama güvenliği üzerine çalışıyorum. En çok odaklandığım çerçeve OWASP Top 10; bu liste, dünyanın dört bir yanındaki gerçek güvenlik ihlali verilerinden derleniyor ve web uygulamalarındaki en kritik on güvenlik riskini sıralıyor. Bizim OWASP-Reasoner sistemimiz de tam olarak bu liste üzerine kurulu bir kural tabanlı akıl yürütme motoru.

---

**Furkan Yapıcı:** Sistemin yapısından bahseder misin? Teknik olarak nasıl çalışıyor?

**Hamed Mohamed:** Sistemin üç katmanı var: birincisi bilgi tabanı — bu, rules.json adında bir JSON dosyası. İçinde her OWASP kategorisi için tanımlar, belirtiler (indicators), ağırlık skorları (weight) ve çözüm önerileri (remediation) bulunuyor. İkincisi çıkarım motoru — kullanıcının verdiği semptomlara göre hangi güvenlik açığının var olduğunu hesaplıyor. Üçüncüsü kullanıcı arayüzü. Bu aslında klasik bir uzman sistemin yapısı: bilgi tabanı + çıkarım motoru + kullanıcı arayüzü.

---

**Furkan Yapıcı:** Peki hangi açıklar en yaygın ve en tehlikeli?

**Hamed Mohamed:** 2021 listesine göre birinci sırada **Broken Access Control (A01:2021)** var. Yani bir kullanıcının erişmemesi gereken başka bir kullanıcının verilerine veya işlevlere erişebilmesi. En basit ve en sık karşılaştığım vakası **IDOR** — Insecure Direct Object Reference. Mesela URL'de `/profile?id=42` yazıyor; saldırgan bunu `id=43` yapıyor ve başka birinin profilini görüyor. Neden tehlikeli? Çünkü sunucu tarafında sahiplik doğrulaması yapılmıyor. Sistemimizde bu için özel bir kural var: `R-IDOR-01`.

---

**Furkan Yapıcı:** Peki ya izinsiz sayfalara erişim? O da bu kategoride mi?

**Hamed Mohamed:** Evet, **Forced Browsing (R-FB-01)** da A01 altında. Saldırgan `/admin`, `/dashboard`, `/backup` gibi URL'leri tahmin ederek giriş yapmadan erişmeye çalışıyor. En tehlikeli işaret: uygulama yalnızca UI'da butonları gizliyor ama sunucu tarafında hiçbir kontrol yok. Bunu tespit etmek için soru şu: "Giriş yapmadan yönetim sayfasına URL ile doğrudan erişebiliyor musun?" Eğer evet ise açık kesin.

---

**Furkan Yapıcı:** Şifreleme konusuna değinelim. Bu alanda neler var?

**Hamed Mohamed:** **Cryptographic Failures (A02:2021)** daha önce "Sensitive Data Exposure" olarak biliniyordu. Kategoride birkaç önemli alt tür var. En yaygını: şifrelerin **MD5 veya SHA-1** ile hashlenmesi — bu algoritmalar artık kriptografik açıdan yetersiz. Bunlarla hashlenen şifreleri rainbow table saldırılarıyla kırmak dakikalar alıyor. Doğru yol: **bcrypt, scrypt veya Argon2** kullanmak ve her şifre için benzersiz bir salt değeri eklemek.

İkinci büyük hata: **hard-coded password** — şifreleri kaynak koduna yazmak. GitHub'a bu tip kodlar commit edilmesi çok sık rastladığım bir durum; `.env` dosyasının versiyon kontrolüne eklenmesi. Çözüm: ortam değişkenleri (environment variables) veya Vault sistemleri. Ayrıca şifre sıfırlama tokenları `Math.random()` gibi kriptografik olmayan fonksiyonlarla üretiliyorsa — ki bu **Insufficient Entropy (R-CF-03)** problemi — saldırgan o tokenı tahmin edebilir. Node.js'de doğru kullanım `crypto.randomBytes()`.

---

**Furkan Yapıcı:** Peki veri iletiminde ne dikkat etmek gerekiyor?

**Hamed Mohamed:** **Sensitive Data in Transit (R-CF-04)** — hassas veri HTTP üzerinden gönderilmesi büyük bir hata. Öncelikle HTTPS zorunlu olmalı, HTTP istekleri 301 ile yönlendirilmeli. **HSTS header** — `Strict-Transport-Security: max-age=31536000; includeSubDomains` — eklenmeli. TLS sertifika doğrulaması asla devre dışı bırakılmamalı. TLS 1.2 veya üstü kullanılmalı.

---

**Furkan Yapıcı:** Injection açıklarına geçelim. SQL Injection'ı nasıl açıklarsın?

**Hamed Mohamed:** **SQL Injection (R-SQLI-01, A03:2021)** — en temel ve hâlâ en yaygın açıklardan biri. Dört ana belirtisi var: Birincisi, giriş alanına tek tırnak (`'`) yazınca SQL syntax error alıyorsun. İkincisi, prepared statement ya da ORM kullanılmıyor, ham SQL sorgusu var. Üçüncüsü, kullanıcı girdisi string birleştirme ile sorguya ekleniyor — bu en tehlikeli yol. Dördüncüsü, `1=1` gibi boolean ifadeler yazınca sorgu tüm kayıtları döndürüyor. Çözüm kesin: **her sorguda parameterized query (prepared statement)**, sunucu tarafında whitelist tabanlı doğrulama ve veritabanı hesabına minimum yetki.

---

**Furkan Yapıcı:** XSS ve OS Command Injection da A03 altında mı?

**Hamed Mohamed:** Evet. **XSS (R-XSS-01)** — saldırgan `<script>alert(1)</script>` gibi bir kodu forma yazıyor, sayfa bunu filtre etmeden HTML olarak yansıtıyorsa çalışıyor. İki çeşiti var en sık: Reflected XSS ve Stored XSS. Korunma için: çıktıda HTML encoding ve **Content-Security-Policy (CSP) header**. React ve Angular gibi modern frameworkler otomatik escape yapıyor ama bu güvene çok yaslanmamak lazım.

**OS Command Injection (R-CMD-01)** daha az bilinir ama çok tehlikeli. Uygulama kullanıcı girdisini `exec()` veya `system()` gibi fonksiyonlara parametre olarak veriyorsa — örneğin bir ping aracı yapıyorsun ve kullanıcının yazdığı IP'yi komuta ekliyorsun — saldırgan `;rm -rf /` ekleyebilir. Çözüm: OS komutlarını hiç çağırma, bunun yerine dilin yerleşik kütüphanelerini kullan. Zorunluysa `execFile` kullan ve whitelist doğrulama uygula.

---

**Furkan Yapıcı:** Tasarım aşamasında yapılan hatalar için ne düşünüyorsun?

**Hamed Mohamed:** **Insecure Design (A04:2021, R-ID-01)** — bu kategori diğerlerinden farklı; kodlama hatası değil, mimari sorun. Tehdit modellemesi (threat modeling) yapılmamışsa güvenlik açıkları baştan sisteme gömülü oluyor. İş mantığı (business logic) hataları da burada: mesela bir e-ticaret sitesinde sepete eksi miktarda ürün ekleyip para kazanmak — bunu otomatik tarama araçları bulamaz, sadece insan analizi bulur. Kritik işlemlerde adım adım onay mekanizması — SDLC'nin en başında kurulmalı.

---

**Furkan Yapıcı:** Güvenlik yapılandırma hataları konusunda neler var?

**Hamed Mohamed:** **Security Misconfiguration (A05:2021)** — benim en sık karşılaştığım sorun bu. Üç alt tür var: Birincisi **Exposed Debug Information (R-MC-01)** — hata sayfalarında stack trace veya dosya yolu görünüyor, üretimde debug modu açık, varsayılan kimlik bilgileri (`admin/admin`) değiştirilmemiş, güvenlik HTTP header'ları eksik (`X-Frame-Options`, `HSTS`, `CSP`). İkincisi **Configuration (R-MC-02)** — sunucu varsayılan yapılandırmayla çalışıyor, gereksiz portlar aktif. Üçüncüsü **XXE (R-MC-03)** — XML External Entities açığı. XML parser dış varlıkları çözümlüyorsa saldırgan `file:///etc/passwd` okuyabilir. Çözüm: mümkünse JSON kullan, DTD ve external entity işlemeyi kapat.

---

**Furkan Yapıcı:** Güncel olmayan bileşenler konusunda ne düşünüyorsun?

**Hamed Mohamed:** **Vulnerable and Outdated Components (A06:2021, R-VOC-01)** — npm, pip, maven gibi paket yöneticilerinde eski versiyonlar çok ciddi güvenlik açıkları içerebiliyor. Ve projelerde çoğunlukla kimse bunu takip etmiyor. CI/CD sürecine `npm audit` veya Snyk gibi SCA araçları entegre etmek zorunlu. End-of-Life yazılım çalıştırmak — eski PHP, eski Node.js versiyonları — için de aynı kural geçerli.

---

**Furkan Yapıcı:** Kimlik doğrulama tarafında neler var?

**Hamed Mohamed:** **Identification and Authentication Failures (A07:2021)** — üç alt tipi var. Birincisi **Weak Authentication (R-AUTH-01)**: brute-force koruması yok, MFA desteklenmiyor, zayıf şifreler (`123456`) kabul ediliyor, giriş sonrası session token yenilenmiyor. İkincisi **Session Fixation (R-AUTH-02)**: kullanıcı giriş yaptıktan sonra Session ID değişmiyorsa saldırgan önceden belirlediği bir session ID'yi URL üzerinden enjekte edip oturumu ele geçirebilir. Doğru davranış: giriş sonrası `Session Regeneration`. Üçüncüsü **Weak Password Recovery (R-AUTH-03)**: şifre sıfırlama token'ları çok uzun süre geçerli ya da güvenlik soruları (`annenizin kızlık soyadı`) kullanılıyor. Token'lar 15-30 dakika geçerli ve tek kullanımlık olmalı.

---

**Furkan Yapıcı:** CI/CD süreçlerinde güvenlik açıkları oluşabiliyor mu?

**Hamed Mohamed:** Kesinlikle. **Software and Data Integrity Failures (A08:2021, R-SDI-01)** — kullanıcıdan gelen serialize edilmiş veriler (Java Object, Python Pickle) kontrol edilmeden deserialize ediliyorsa büyük risk var. Ayrıca uygulamanın kendi güncellemelerini dijital imza doğrulaması yapmadan indirmesi de tehlikeli. CI/CD pipeline'da kod incelenmeden doğrudan production'a deploy yapılabiliyorsa bu açık. SCA araçlarını pipeline'a entegre etmek zorunlu.

---

**Furkan Yapıcı:** Loglama ve izleme konusunda ne önerirsin?

**Hamed Mohamed:** **Security Logging and Monitoring Failures (A09:2021, R-LOG-01)** — saldırıların geç fark edilmesinin en büyük nedeni bu. Başarılı/başarısız giriş denemeleri, şifre değişiklikleri, para transferleri loglanmıyorsa saldırı tespiti imkânsız. Logları yerel tutmak da tehlikeli çünkü saldırgan sunucuya erişirse logları silebilir — merkezi bir log sunucusu (ELK Stack gibi) şart. Şüpheli aktivitede sistem yöneticisine otomatik uyarı gidecek bir alerting mekanizması da kurulmalı.

---

**Furkan Yapıcı:** Son olarak SSRF nedir?

**Hamed Mohamed:** **Server-Side Request Forgery (A10:2021, R-SSRF-01)** — 2021 listesinde yeni giren ama çok tehlikeli bir açık. Uygulama kullanıcının verdiği bir URL'ye istek atıyor ama bu URL'yi doğrulamıyorsa saldırgan `localhost` veya iç ağ adreslerini hedef gösterebilir. AWS ortamlarında `169.254.169.254` adresine istek atarak IAM anahtarları çekilebilir. Çözüm: strict allowlist, sadece HTTP/HTTPS'e izin ver (`file://`, `ftp://` engelle), iç ağ IP'lerini uygulama veya ağ seviyesinde blokla.

---

**Furkan Yapıcı:** Tüm bu bilgileri bir araya getirdiğinde, bir güvenlik analizinde nereden başlarsın?

**Hamed Mohamed:** Her zaman en yüksek riskten başlarım. IDOR ve Broken Access Control kontrolü ilk adım — URL manipülasyonu çok hızlı test edilebilir. Sonra giriş formlarında SQL Injection ve XSS denemeleri. Ardından HTTP response header'larını incelerim — CSP, HSTS, X-Frame-Options var mı? Ardından authentication akışını test ederim — brute-force koruması, MFA, session yönetimi. Son olarak bağımlılık güncelliklerini kontrol ederim.

---

## 4. MÜLAKATTAN ÇIKARILAN BİLGİ BİRİMLERİ

### 4.1 Kavramsal Bilgiler (Conceptual Knowledge)

| # | Kavram | Kategori | CWE | Açıklama |
|---|---|---|---|---|
| 1 | IDOR | A01:2021 | CWE-639 | URL/parametre ID değiştirilince başka kullanıcının verisine erişim |
| 2 | Forced Browsing | A01:2021 | CWE-425 | Tahmin edilen URL'lerle korumalı sayfalara erişim |
| 3 | Weak Password Hashing | A02:2021 | CWE-916 | MD5/SHA-1 ile şifre hashleme; rainbow table saldırısına açık |
| 4 | Hard-coded Password | A02:2021 | CWE-259 | Şifrelerin kaynak koduna/config dosyalarına gömülmesi |
| 5 | Insufficient Entropy | A02:2021 | CWE-331 | Math.random() ile token üretimi; tahmin edilebilir |
| 6 | Sensitive Data in Transit | A02:2021 | CWE-319 | HTTP üzerinden hassas veri gönderimi |
| 7 | OS Command Injection | A03:2021 | CWE-78 | Kullanıcı girdisinin OS komutuna parametre olarak eklenmesi |
| 8 | SQL Injection | A03:2021 | CWE-89 | Ham SQL sorgusuna kullanıcı girdisinin dahil edilmesi |
| 9 | XSS | A03:2021 | CWE-79 | Encode edilmemiş kullanıcı girdisinin HTML'e yansıtılması |
| 10 | Missing Threat Modeling | A04:2021 | CWE-1008 | Tasarım aşamasında güvenlik analizi yapılmaması |
| 11 | Exposed Debug Info | A05:2021 | CWE-215 | Üretimde stack trace, debug modu açık, varsayılan şifreler |
| 12 | XXE | A05:2021 | CWE-611 | XML parser'ın dış varlıkları çözümlemesi |
| 13 | Outdated Components | A06:2021 | CWE-1104 | Bilinen zafiyetli eski kütüphane/framework kullanımı |
| 14 | Weak Authentication | A07:2021 | CWE-287 | Brute-force koruması yok, MFA yok, zayıf şifre politikası |
| 15 | Session Fixation | A07:2021 | CWE-384 | Giriş sonrası Session ID değişmemesi |
| 16 | Weak Password Recovery | A07:2021 | CWE-640 | Uzun ömürlü sıfırlama token'ları / tahmin edilebilir güvenlik soruları |
| 17 | Insecure Deserialization | A08:2021 | CWE-829 | Güvensiz deserializasyon / imzasız güncelleme |
| 18 | Insufficient Logging | A09:2021 | CWE-778 | Güvenlik olaylarının loglanmaması / merkezi izleme yok |
| 19 | SSRF | A10:2021 | CWE-918 | Sunucunun kullanıcı belirttiği iç ağ URL'lerine istek atması |

---


---

### 4.3 Örtük Bilgiler (Tacit Knowledge)

Mülakatın serbest akışında uzmanın doğrudan söylemeden aktardığı sezgisel bilgiler:

1. **Test önceliklendirmesi:** Uzman bir güvenlik analizine her zaman IDOR ve Broken Access Control ile başlar çünkü bunlar URL üzerinden dakikalar içinde test edilebilir.
2. **Risk sıralama:** Saldırı yüzeyi ne kadar geniş ve istismarı ne kadar kolaysa o açık önce ele alınır. Ağırlık (weight) skoru bu mantığı sayısallaştırır.
3. **False positive yönetimi:** Bir semptomu tek başına yeterli saymaz; belirli eşik (threshold) skorlarına ulaşıldığında sonuç verir — bu örtük bir doğrulama şemasıdır.
4. **Tasarım > Kod:** OWASP A04 (Insecure Design) açıklarının otomatik araçlarla bulunamayacağını vurgulayan uzman, insan analizinin bu kategoride vazgeçilmez olduğunu ima ediyor.
5. **Güven hiyerarşisi:** "Hiçbir kullanıcı girdisine güvenme" — bu tek cümle tüm A03 kategorisini özetliyor.

---

## 5. BİLGİ KAZANIMI DEĞERLENDİRMESİ

### Yöntemin Etkinliği

Yapısal olmayan mülakat bu görev için oldukça uygun bulunmuştur. Uzmanın OWASP-Reasoner sisteminin iç mantığını (bilgi tabanı yapısı, ağırlık skorları, eşik değerleri) kendi söylemiyle açıklaması, kurallara dönüştürülebilecek zengin bilgi ürettiği görülmüştür. Özellikle IF-THEN kurallarının uzmanın kendi anlatımından doğrudan çıkarılabilmesi bu yöntemin gücünü kanıtlamaktadır.

### Doğrulama Notu

Elde edilen tüm IF-THEN kuralları, `rules.json` bilgi tabanındaki gerçek `indicators`, `weight` ve `threshold` değerleriyle çapraz kontrol edilmiş ve birebir uyum içinde olduğu doğrulanmıştır.

### Karşılaşılan Zorluklar

| Zorluk | Açıklama |
|---|---|
| Kapsam genişliği | 10 kategori × birden fazla alt tip; tek seansta tamamlamak güç |
| Teknik derinlik | Bilgi mühendisinin alt seviyede teknik soruları takip etmesi deneyim gerektirdi |
| Formalizasyon | Uzmanın anlatımındaki eşikleri ve ağırlıkları kurala dönüştürmek dikkat ister |

### Sonraki Adım Önerileri

1. **Protokol Analizi** — Uzmanın gerçek bir güvenlik testi yaparken düşünce sürecini sesli vermesi sağlanabilir.
2. **Yapısal Mülakat** — Elde edilen kurallar yapılandırılmış sorularla doğrulanabilir.
3. **Kart Sıralama** — Açıkların öncelik sırasını uzmanla birlikte kategorize etmek için kullanılabilir.

---

## 6. SONUÇ

Bu çalışmada web uygulama güvenliği uzmanı Hamed Mohamed ile gerçekleştirilen yapısal olmayan mülakat aracılığıyla OWASP Top 10 çerçevesinde kapsamlı bir bilgi birikimi temin edilmiştir. Elde edilen bilgiler; 19 kavramsal birim, 10 IF-THEN kuralı ve 5 örtük bilgi parçası olarak başarıyla formalize edilmiştir. Kuralların tamamı, OWASP-Reasoner projesinin gerçek `rules.json` bilgi tabanı ile doğrulanmıştır.

Bu mülakat süreci, yapısal olmayan mülakatın; özellikle uzmanın ağırlıklandırma mantığını, önceliklendirme sezgisini ve sistem mimarisi hakkındaki örtük bilgisini ortaya çıkarmada ne denli güçlü bir araç olduğunu açıkça ortaya koymuştur.

---

## KAYNAKÇA

- OWASP Foundation. (2021). *OWASP Top Ten 2021*. https://owasp.org/Top10/
- OWASP Foundation. *OWASP Cheat Sheet Series*. https://cheatsheetseries.owasp.org/
- MITRE Corporation. *Common Weakness Enumeration (CWE)*. https://cwe.mitre.org/
- Giarratano, J., & Riley, G. (2004). *Expert Systems: Principles and Programming* (4th ed.). Thomson Course Technology.
- Feigenbaum, E. A. (1977). The art of artificial intelligence. *IJCAI Proceedings*, 1014–1029.
- Mohamed, H. & Yapıcı, F. (2026). OWASP-Reasoner Knowledge Base [rules.json]. Özel proje bilgi tabanı.

---

*Uzman: **Hamed Mohamed***  
*Bilgi Mühendisi: **Furkan Yapıcı***  
*Yönetici: **Rawezh Niyaz Ali***  
*Tarih: 02.03.2026*

