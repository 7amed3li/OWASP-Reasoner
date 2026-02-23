# OWASP Uzman Sistemi

OWASP Top 10 zafiyetlerini tespit etmek için geliştirilmiş kural tabanlı uzman sistem.

## Teknolojiler

- **Node.js**: Çıkarım motoru ve backend mantığı
- **React.js**: Kullanıcı arayüzü
- **JSON**: Kural tabanı (bilgi tabanı)

## Klasör Yapısı

```
owasp-expert-system/
├── backend/
│   ├── src/          - Çıkarım motoru
│   └── knowledge-base/ - JSON kural dosyaları
└── frontend/         - React uygulaması
```

## Kurulum

```bash
cd backend
npm install
node src/engine.js
```
