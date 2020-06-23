NodeFlake
=========

Like twitters [SnowFlake](https://github.com/twitter/snowflake), but made with NodeJS. 



Why?
----

Because it was there. 



Goals
-----

  - Generate unique ids without need for a stored seed.
  - Ids should be mostly sortable by time/order
  - One million ids per second. 
  - Fast response and high availability (numbers later)


State Right Now
---------------

As of now, you can ping the service (http) and get an ID back via json response. (Maybe jsonp support would be nice) It will generate an ID. This works with varying success based on the time of day (there is the clue). It really isn't ready for any prime time use. 

Also, I need to make it more "node-like" with an actual event model.

Run by using `node ./nodeflake.js` and then trying hitting `http://localhost:1337` 


Whats Next
----------

Introduce socket connection for cross-service ID delivery. Fix issues. Finish the port from what twitter is doing.




