# Application Scaling and Optimization Strategy

## Overview
This document outlines the specific architectural decisions deployed within the project to ensure the infrastructure can adequately handle high traffic, large database volumes, and secure state handling in a production environment. Moving past basic CRUD demonstrations, the application proactively mitigates common Full-Stack bottlenecks.

## 1. Network Demand and Caching Mitigation

### Problem
In standard React implementations relying on `useEffect` and `useState`, every component mount triggers redundant API calls, flooding the backend infrastructure.

### Solution: TanStack Query (React Query)
The frontend utilizes TanStack Query to decouple remote data from local memory.
* **Stale-While-Revalidate**: Queries load instantly from the local cache while checking the server in the background, making the UI feel extremely responsive.
* **Query Invalidation**: Following destructive assignments or modifications (such as deleting or creating a record), the application utilizes manual `invalidateQueries` to automatically sync the view layer without requiring a forced page reload.

## 2. Infrastructure Memory Relief

### Problem
As users accumulated thousands of records, fetching massive, un-paginated `JSON` payloads crashed server memory constraints and severely bogged down browser rendering cycles. 

### Solution: Offset Pagination
The application relies on infinite-fetching techniques to batch request sizes.
* **Query Limits**: The backend `/todo` endpoint requires and extracts `page` and `limit` boundaries, executing `skip()` and `limit()` pipelines against the MongoDB driver.
* **Frontend Intersection**: `useInfiniteQuery` merges sequential arrays of small sizes (defaulted to 10) enabling a 'Load More' dynamic workflow that is easy on DOM sizes.
* **Counting Documents**: The backend automatically tracks `countDocuments` and limits unnecessary network calls when standard thresholds are empty.

## 3. Storage Security and Cross-Site Mitigations

### Problem
Storing session tokens in `localStorage` rendered the application vulnerable to XSS attacks, putting user accounts at significant risk if malicious scripts ran in the client's browser.

### Solution: Secure Cookies
The token authorization structure was converted into HTTP-Only implementations.
* **Express Cookie Parser**: Tokens are embedded locally into HTTP cookies utilizing the parameters `httpOnly: true`, `secure: true`, and `sameSite: strict`.
* **Axios Credentials Mapping**: Global interceptors attach `withCredentials: true` to all outgoing requests. The frontend javascript no longer actively "knows" what the secure JSON token strings represent.

## 4. Middleware Driven Input Validation

### Problem
Executing Zod parsing manually inside controller files mixed formatting rules intimately with strict model business logic, expanding tech-debt.

### Solution: Dynamic Middleware Interceptors
A wrapper function, `validateRequest`, dynamically assesses request bodies mapping against specific Zod objects.
* If a request violates standard expectations prior to reaching typical routing controllers, the Express router rejects it immediately avoiding resource burn and empty allocations.

## Conclusion
These implemented factors allow the system to successfully execute functions and operate reliably without degradation—securing credentials intelligently while saving computing resources across heavy interactions.
