# SweetSpot — Padel Store

An online store for padel rackets built with **React**. Products are loaded from a **Supabase** (PostgreSQL) database, the cart is kept between visits, and the checkout validates the form and sends an order confirmation e-mail through **EmailJS**.

> **Note:** this is a portfolio project. No real payments are processed.

## Features

- **Product catalogue** loaded from Supabase, with filters for racket shape and player level
- **Home page** with best-rated rackets, a racket shape guide and player testimonials
- **Shopping cart** drawer built with the Context API — change quantities, remove items; the cart is saved in `localStorage`
- **Checkout**
  - delivery form and choice of shipping method
  - discount codes
  - card form that formats input as you type and validates it (Luhn checksum, expiry date)
  - order confirmation e-mail sent through EmailJS
- **Routing** with React Router, including a redirect when the cart is empty
- **Tests** written with Jest and React Testing Library, run on every push by GitHub Actions

## Tech stack

React 18 · React Router 6 · Context API & custom hooks · Supabase · EmailJS · Jest · React Testing Library · GitHub Actions

## Project structure

```
src/
├── components/        UI components (Home, ProductList, Cart, Checkout, ...)
├── context/           CartContext — global cart state saved in localStorage
├── hooks/             useProducts, useOrderTotal, useCheckoutForm
├── services/          emailService — EmailJS integration
├── utils/             input formatters and form validators
├── data/              static content for the home page
└── supabaseClient.js  Supabase client configured from environment variables
```

## Getting started

**Requirements:** Node.js 18+, a free [Supabase](https://supabase.com) project and, optionally, an [EmailJS](https://www.emailjs.com) account for confirmation e-mails.

```bash
npm install
cp .env.example .env   # then fill in your own keys
npm start              # http://localhost:3000
```

### Database

The app reads from a single `products` table. The `isRecommended` column is camelCase, so it needs double quotes in SQL. Read-only public access is granted through Row Level Security:

```sql
create table products (
  id              bigint generated always as identity primary key,
  name            text not null,
  price           numeric(10, 2) not null,
  shape           text not null,           -- Round | Teardrop | Diamond
  level           text not null,           -- Beginner | Intermediate | Advanced
  rating          numeric(2, 1),
  reviews         integer default 0,
  image_url       text,
  "isRecommended" boolean default false
);

alter table products enable row level security;

create policy "Products are publicly readable"
  on products for select
  to anon
  using (true);
```

### EmailJS template

The order confirmation template receives these variables: `to_email`, `order_id`, `customer_name`, `delivery_address`, `order_total` and `order_items` (a list with `name`, `price`, `units` and `image`).

### Trying out the checkout

| What | Value |
| --- | --- |
| Discount code | `SWEETSPOT10` (10% off) |
| Card number | `4242 4242 4242 4242` |
| Expiry date / CVV | any future date / any 3 digits |

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development mode |
| `npm test` | Runs the test suite |
| `npm run build` | Creates a production build in `build/` |

## Possible improvements

- Save orders in the database and validate discount codes on the server
- Integrate a real payment provider (e.g. Stripe in test mode)
- Add a product details page and search
- Migrate from Create React App to Vite and TypeScript
