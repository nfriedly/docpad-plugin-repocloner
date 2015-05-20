// Generated by CoffeeScript 1.8.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = function(BasePlugin) {
    var RepoclonerPlugin, TaskGroup, extendr, fsUtil, safeps;
    TaskGroup = require('taskgroup').TaskGroup;
    extendr = require('extendr');
    safeps = require('safeps');
    fsUtil = require('fs');
    return RepoclonerPlugin = (function(_super) {
      __extends(RepoclonerPlugin, _super);

      function RepoclonerPlugin() {
        return RepoclonerPlugin.__super__.constructor.apply(this, arguments);
      }

      RepoclonerPlugin.prototype.name = 'repocloner';

      RepoclonerPlugin.prototype.config = {
        repos: null
      };

      RepoclonerPlugin.prototype.populateCollectionsBefore = function(opts, next) {
        var config, docpad, repos, tasks;
        docpad = this.docpad;
        config = docpad.getConfig();
        tasks = new TaskGroup().setConfig({
          concurrency: 0
        }).once('complete', next);
        repos = this.config.repos || [];
        repos.forEach(function(repoDetails) {
          return tasks.addTask(function(complete) {
            var _opts;
            repoDetails.path = repoDetails.path.replace(/^src\/documents/, config.documentsPaths[0]).replace(/^src\/files/, config.filesPaths[0]).replace(/^src/, config.srcPath).replace(/^out/, config.outPath);
            docpad.log('info', "Updating " + repoDetails.name + "...");
            _opts = {
              remote: 'origin',
              branch: 'master',
              output: true
            };
            extendr.extend(_opts, repoDetails);
            return safeps.initOrPullGitRepo(_opts, (function(_this) {
              return function(err) {
                if (err) {
                  docpad.warn(err);
                }
                docpad.log('info', "Updated " + repoDetails.name);
                return complete();
              };
            })(this));
          });
        });
        tasks.run();
      };

      return RepoclonerPlugin;

    })(BasePlugin);
  };

}).call(this);
