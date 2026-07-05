# E-Ticaret Mağazası

Bu proje, tek bir mağaza sahibine ait mini bir e-ticaret web uygulamasıdır. Uygulama; ürünlerin listelendiği vitrin tarafı, kullanıcı kayıt/giriş sistemi, sipariş oluşturma akışı ve mağaza sahibinin ürün, kategori, sipariş, kullanıcı ve gelir yönetimini yapabildiği admin panelinden oluşur.

## Proje Amacı

Projenin amacı; katmanlı mimari, RESTful API tasarımı, PostgreSQL veritabanı kullanımı, Entity Framework Core, JWT tabanlı kimlik doğrulama ve React + Vite frontend geliştirme süreçlerini uçtan uca uygulamaktır.

Kullanıcılar ürünleri görüntüleyebilir, ürün detayına gidebilir, adet seçerek sipariş oluşturabilir. Sipariş başarılı olduğunda ürün stoğu otomatik olarak düşer ve toplam gelir admin panelinde görüntülenir.

## Kullanılan Teknolojiler

### Backend

- ASP.NET Core Web API
- .NET
- Entity Framework Core
- PostgreSQL
- Npgsql
- JWT Authentication
- BCrypt
- Swagger
- Docker
- Katmanlı Mimari

### Frontend

- React
- Vite
- Axios
- React Router DOM
- CSS

## Proje Mimarisi

Backend tarafı katmanlı mimari ile geliştirilmiştir.

```text
Store
├── Store.Domain
├── Store.Application
├── Store.Infrastructure
└── Store.API
```

### Store.Domain

Entity sınıfları ve enum yapıları bulunur.

### Store.Application

DTO sınıfları, servis arayüzleri, iş kuralları ve servis implementasyonları bulunur.

### Store.Infrastructure

Entity Framework Core DbContext, repository implementasyonları ve migration dosyaları bulunur.

### Store.API

Controller sınıfları, dependency injection kayıtları, middleware ayarları, CORS, Swagger ve authentication yapılandırmaları bulunur.

## Frontend Yapısı

```text
store-client
└── src
    ├── api
    ├── components
    ├── pages
    │   └── admin
    ├── App.jsx
    ├── main.jsx
    └── App.css
```

## Veritabanı Tabloları

Projede temel olarak şu tablolar kullanılmıştır:

- Category
- Product
- ProductImage
- User
- Order

## Temel Özellikler

### Kullanıcı Tarafı

- Anasayfa görüntüleme
- Ürün listeleme
- Ürün detay sayfası
- Adet seçerek sipariş oluşturma
- Kayıt olma
- Giriş yapma

### Admin Tarafı

- Dashboard görüntüleme
- Toplam gelir görüntüleme
- Ürün listeleme ve ürün ekleme
- Kategori listeleme ve kategori ekleme
- Siparişleri görüntüleme
- Kullanıcıları görüntüleme

## İş Kuralları

- Sipariş adedi stoktan büyükse sipariş reddedilir.
- Başarılı siparişten sonra ürün stoğu sipariş adedi kadar düşürülür.
- Üründe indirimli fiyat varsa sipariş birim fiyatı olarak DiscountPrice kullanılır.
- İndirimli fiyat yoksa Price kullanılır.
- TotalPrice değeri UnitPrice x Quantity şeklinde hesaplanır.
- Gelir hesabı siparişlerin TotalPrice toplamı üzerinden yapılır.
- Kullanıcı şifreleri veritabanında hashlenmiş olarak saklanır.
- UserId nullable olarak tanımlanmıştır; kullanıcı giriş yapmadan da sipariş oluşturulabilir.

## API Endpointleri

### Auth

```http
POST /api/Auth/register
POST /api/Auth/login
```

### Categories

```http
GET /api/Categories
POST /api/Categories
PUT /api/Categories/{id}
DELETE /api/Categories/{id}
```

### Products

```http
GET /api/Products
GET /api/Products/{id}
POST /api/Products
PUT /api/Products/{id}
DELETE /api/Products/{id}
```

### Product Images

```http
GET /api/ProductImages
GET /api/ProductImages/{id}
POST /api/ProductImages
PUT /api/ProductImages/{id}
DELETE /api/ProductImages/{id}
```

### Orders

```http
POST /api/Orders
GET /api/Orders
GET /api/Orders/revenue
```

### Users

```http
GET /api/Users
```

## Kurulum

### 1. Proje Ana Klasörüne Gidin

```bash
cd C:\Users\User\Desktop\Store
```

### 2. PostgreSQL Docker Container'ını Çalıştırın

Container çalışıyor mu kontrol etmek için:

```bash
docker ps
```

Container kapalıysa çalıştırmak için:

```bash
docker start store-postgres
```

## Backend Kurulumu

Backend projesine gidin:

```bash
cd C:\Users\User\Desktop\Store\Store.API
```

Projeyi çalıştırın:

```bash
dotnet run
```

Backend çalıştıktan sonra Swagger şu adresten açılır:

```text
http://localhost:5156/swagger/index.html
```

## Veritabanı Migration Komutları

Migration eklemek için:

```bash
dotnet ef migrations add MigrationName --project Store.Infrastructure --startup-project Store.API
```

Veritabanını güncellemek için:

```bash
dotnet ef database update --project Store.Infrastructure --startup-project Store.API
```

Visual Studio Paket Yöneticisi Konsolu kullanılacaksa Default Project olarak `Store.Infrastructure` seçilmelidir.

```powershell
Add-Migration MigrationName
Update-Database
```

## Frontend Kurulumu

Frontend klasörüne gidin:

```bash
cd C:\Users\User\Desktop\Store\store-client
```

Paketleri yükleyin:

```bash
npm install
```

Frontend projesini çalıştırın:

```bash
npm run dev
```

Frontend şu adreste çalışır:

```text
http://localhost:5173/
```

## Çalıştırma Sırası

Projeyi çalıştırırken önce backend, sonra frontend başlatılmalıdır.

### 1. Backend

```bash
cd C:\Users\User\Desktop\Store\Store.API
dotnet run
```

### 2. Frontend

Yeni bir terminal açıp:

```bash
cd C:\Users\User\Desktop\Store\store-client
npm run dev
```

## Test Edilen Özellikler

Aşağıdaki özellikler test edilmiştir:

- Backend çalışıyor.
- Swagger açılıyor.
- Frontend açılıyor.
- Ürünler frontend tarafında listeleniyor.
- Ürün detay sayfası çalışıyor.
- Checkout sayfası açılıyor.
- Sipariş başarıyla oluşturuluyor.
- Sipariş oluşturulunca stok düşüyor.
- Admin dashboard verileri görüntüleniyor.
- Toplam gelir görüntüleniyor.
- Admin sipariş listesi görüntüleniyor.
- Admin ürün listesi görüntüleniyor.
- Admin kategori listesi görüntüleniyor.
- Admin kullanıcı listesi görüntüleniyor.
- Register çalışıyor.
- Login çalışıyor.
- Admin ürün ekleme çalışıyor.
- Admin kategori ekleme çalışıyor.

## Örnek Test Verileri

### Kategori

```json
{
  "name": "Elektronik",
  "parentCategoryId": null
}
```

```json
{
  "name": "Bilgisayar",
  "parentCategoryId": 1
}
```

### Ürün

```json
{
  "title": "Lenovo IdeaPad 3",
  "description": "Günlük kullanım için uygun laptop",
  "price": 25000,
  "discountPrice": 22000,
  "stockQuantity": 10,
  "categoryId": 2
}
```

### Sipariş

```json
{
  "productId": 1,
  "quantity": 1,
  "customerName": "Ebru Sena",
  "customerPhone": "05555555555",
  "customerAddress": "Konya Meram"
}
```

## Notlar

- Backend terminali kapatılırsa Swagger ve API bağlantısı kapanır.
- Frontend terminali kapatılırsa React uygulaması kapanır.
- Backend API adresi frontend içinde şu şekilde kullanılmıştır:

```text
http://localhost:5156/api
```

- React + Vite varsayılan portu:

```text
http://localhost:5173/
```

## Proje Durumu

Projenin ana backend ve frontend akışları tamamlanmıştır. Ürün listeleme, ürün detay, sipariş oluşturma, stok düşürme, admin panel, dashboard, gelir görüntüleme, kullanıcı kayıt ve giriş işlemleri çalışır durumdadır.

## Geliştirici

Ebru Sena Özsöğüt
