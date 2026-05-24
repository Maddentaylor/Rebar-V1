# RMS Rebar Machine Service Website

## 1. Project Description
RMS Rebar Machine Service is a heavy industrial machinery company. The website serves as a professional marketing and inquiry platform targeting construction companies, contractors, and job site managers. Core value: showcase machines, parts catalog, and enable customer inquiries.

## 2. Page Structure
- `/` - Homepage (hero, who we are, machine preview, why RMS, contact form)
- `/machines` - Machines listing page (grid of all 10 machines)
- `/machines/:id` - Individual machine detail page (models, features, request info)
- `/parts` - Parts Catalog (browsable by machine, inquiry form)
- `/about` - About page (company story, team)
- `/contact` - Contact page (form + contact info)

## 3. Core Features
- [x] Homepage with hero, machine preview grid, why RMS, contact form
- [x] Machines listing page (10 machines in clean grid)
- [x] Individual machine detail pages
- [x] Parts catalog organized by machine with inquiry form
- [ ] About page
- [ ] Contact page

## 4. Data Model Design
No database needed. All data is static mock data stored in src/mocks/.

## 5. Backend / Third-party Integration Plan
- Supabase: Not needed
- Shopify: Not needed
- Stripe: Not needed
- Forms: Use get_form_url for contact and inquiry forms

## 6. Development Phase Plan

### Phase 1: Homepage + Machines + Parts Catalog
- Goal: Build the 3 core pages requested by user
- Deliverable: Fully designed homepage, machines grid, parts catalog

### Phase 2: Machine Detail Pages + About + Contact
- Goal: Individual machine pages, about page, contact page
- Deliverable: Complete site with all pages linked
