
# Week 03 Answers

## 1. In EventList, what goes wrong if you use the array index as `:key` and the list gets filtered while a card has local state (for example an open details panel)?

An array index identifies an item's position, not the event itself. When the list is filtered, Vue may reuse a component instance for a different event at the same index, so local state such as an open details panel can appear on the wrong card. Using `:key="e.id"` lets Vue track each event by its stable identity.

## 2. Why is `visible` a computed and not a function called from the template? What is the difference when you type in the search box?

`visible` is derived from the events, selected category, and search text, so it is appropriate to define it as a computed value. Vue caches a computed value and recalculates it when one of its reactive dependencies changes. A function called from the template runs whenever the component renders, even if the inputs it uses have not changed.

## 3. EventCard emits `book` instead of changing `event.booked`. Give two reasons.

First, props are read-only, so `EventCard` should not directly mutate the `event` object it receives from its parent. Second, emitting `book` keeps the card focused on displaying the event and reporting the user's action, while the parent owns the data and decides how to update bookings and other related state.

## 4. You write `const { booked } = reactive(event); booked++`. The page does not change. Why?

Destructuring a primitive property from a reactive object copies its current value into a local variable. That local variable is no longer connected to the reactive proxy, so incrementing it does not update the original object's `booked` property or trigger Vue's reactivity. Access the property through the reactive object instead, or use `toRef` when a separate reactive reference is needed.

## 5. Where does `myBookings` live, and why not in `EventCard` or `EventList`?

`myBookings` lives in `App.vue`, because `App.vue` owns the events and coordinates booking changes. `EventCard` displays one event and emits a booking event, while `EventList` manages filtering and passes booking events upward; neither child should own the overall booking state. Keeping the state in the parent lets it update the event's booked count and the booking summary consistently.
