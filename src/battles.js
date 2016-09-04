var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


    function BattlesDAO(database) {
        "use strict";

        this.db = database;
        this.battlesCollection = this.db.collection('battles');

        //get count of all battles function
        this.getCount = function(callback) {
            "use strict";
            let queryDoc = {};
            this.battlesCollection.find(queryDoc).count(function(err, count) {
                if (err) throw err;
                callback(count);
            });
        };

        //get list of all battles function

        this.getBattlesList = function(callback) {
            "use strict";
            this.battlesCollection.find({}).toArray(function(err, result) {
                assert.equal(null, err);
                callback(result);
            });
        };

      this.searchBattles = function(query, callback) {
          "use strict";
          let queryDoc = { $text: { $search: query } };
          this.battlesCollection.find(queryDoc, {sort: {_id:1}})
                                      .toArray(function(err, items) {
                                          assert.equal(err, null);
                                          callback(items);
                                      }
          );
      };
      this.searchBattlesByName = function(query, callback) {
          "use strict";
          let queryDoc = { name : query };
          this.battlesCollection.find(queryDoc, {sort: {_id:1}})
                                      .toArray(function(err, items) {
                                          assert.equal(err, null);
                                          callback(items);
                                      }
          );
      };
      this.searchBattlesByLocation = function(query, callback) {
          "use strict";
          let queryDoc = { location : query };
          this.battlesCollection.find(queryDoc, {sort: {_id:1}})
                                      .toArray(function(err, items) {
                                          assert.equal(err, null);
                                          callback(items);
                                      }
          );
      };
      this.searchBattlesByType = function(query, callback) {
          "use strict";
          let queryDoc = { battle_type : query };
          this.battlesCollection.find(queryDoc, {sort: {_id:1}})
                                      .toArray(function(err, items) {
                                          assert.equal(err, null);
                                          callback(items);
                                      }
          );
      };
      this.searchBattlesByKing = function(query, callback) {
          "use strict";
          let queryDoc = { $or : [ {attacker_king : query}, {defender_king : query} ]};
          this.battlesCollection.find(queryDoc, {sort: {_id:1}})
                                      .toArray(function(err, items) {
                                          assert.equal(err, null);
                                          callback(items);
                                      }
          );
      };
    }



module.exports.BattlesDAO = BattlesDAO;
