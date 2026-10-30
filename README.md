# Week 4 practice: Vue components and reactivity

Campus Events, the reference app we build together in practice sessions.
This week it runs on hard-coded data (`src/data/events.ts`).

Requires Node 24 LTS (npm 11).

```bash
npm install
npm run dev     # open http://localhost:5173
npm test        # component tests (Vitest + Vue Test Utils)
npm run check   # type-check .ts and .vue files
```

Work through the TODOs in this order:

1. `src/components/EventCard.vue`: props, emits, computed, v-if, class and attribute bindings
2. `src/components/EventList.vue`: v-model, computed filtering, v-for with keys, passing events up
3. `src/App.vue`: state that changes when you book; bonus: watch + localStorage

