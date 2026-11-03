# Week 05 — Answers

### 1. Refreshing `/events/2`

In development, the Vite development server serves the application's `index.html` when the browser requests `/events/2`. Vue Router then reads the URL and displays the EventDetailPage. In production, the web server must be configured to redirect unknown frontend routes to `index.html` so that Vue Router can handle them.

### 2. Protecting the organiser page

Yes, a student can still attempt to create an event by sending a request directly to the API instead of using the frontend. A frontend route guard only protects navigation in the browser; it does not secure the API. The backend must authenticate the user, check their role, and reject requests from users who are not organisers.

### 3. Using `watch` instead of `onMounted`

`onMounted` runs only when the component is first mounted. If the user navigates from `/events/1` to `/events/2`, Vue Router may reuse the same component, so `onMounted` will not run again and the page may display the previous event. Using `watch` with `immediate: true` loads the event initially and whenever the route ID changes.

### 4. Using `storeToRefs(store)`

`storeToRefs(store)` preserves reactivity when extracting state and getters from a Pinia store. If we use `const { events } = store`, the destructured value loses its reactive connection to the store. As a result, the component may not update when the events state changes.

### 5. Booking with two requests

If the POST request succeeds but the PATCH request fails, the booking may be saved while the event's booked-seat count remains unchanged. This creates inconsistent data because the booking exists but the seat count does not reflect it. The backend can prevent this by using a database transaction so that both operations succeed together or are rolled back together.