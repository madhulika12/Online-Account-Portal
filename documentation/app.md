# app.js

**last update: 8/22/2016 by James Logan**

This file has two code blocks a config and a run.

### .config

Contains standard routing with ui-router. Also uses `$locationProvider` to enable html5mode. This removes hash marks from urls (it may be necessary to comment this out while developing because the hash removal makes it dificult to refresh the page.)

```
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
```

### .run

The single run block just puts a listener on state-changes which scrolls the view to the top of the page on a successful state change. Normally there would be a way to do this through ui-router, but because we are using separate views for the header and footer we have to do it this way.
