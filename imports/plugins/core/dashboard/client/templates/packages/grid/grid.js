import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { Reaction, i18next } from "/client/api";

function pkgPermissions(pkg) {
  return Reaction.hasPermission(pkg.name);
}

function enableReactionPackage(reactionPackage) {
  const self = reactionPackage;

  Meteor.call("shop/togglePackage", self.packageId, false,
    (error, result) => {
      if (result === 1) {
        Alerts.toast(
          i18next.t(
            "gridPackage.pkgEnabled",
            { app: i18next.t(self.i18nKeyLabel) }
          ),
          "error", {
            type: "pkg-enabled-" + self.name
          }
        );
        if (self.name || self.route) {
          const route = self.name || self.route;
          return Reaction.Router.go(route);
        }
      } else if (error) {
        return Alerts.toast(
          i18next.t(
            "gridPackage.pkgDisabled",
            { app: i18next.t(self.i18nKeyLabel) }
          ),
          "warning"
        );
      }
    }
  );
}

function disableReactionPackage(reactionPackage) {
  const self = reactionPackage;

  if (self.name === "core") {
    return;
  }

  Alerts.alert(
    "Disable Package",
    i18next.t("gridPackage.disableConfirm", { app: i18next.t(self.i18nKeyLabel) }),
    {
      type: "warning",
      showCancelButton: true
    },
    () => {
      Meteor.call("shop/togglePackage", self.packageId, true,
        (error, result) => {
          if (result === 1) {
            return Alerts.toast(
              i18next.t("gridPackage.pkgDisabled", {
                app: i18next.t(self.i18nKeyLabel)
              }),
              "success"
            );
          } else if (error) {
            throw new Meteor.Error("error disabling package", error);
          }
        }
      );
    });
}

Template.packagesGrid.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    groups: [],
    appsByGroup: {},
    apps: []
  });

  this.autorun(() => {
    const apps = Reaction.Apps({provides: "dashboard"});
    const groupedApps = _.groupBy(apps, (app) => {
      return app.container || "misc";
    });
    this.state.set("apps", apps);
    this.state.set("appsByGroup", groupedApps);
    this.state.set("groups", Object.keys(groupedApps));
  });
});

/**
 * packagesGrid helpers
 */
Template.packagesGrid.helpers({
  groups() {
<<<<<<< HEAD
    const group = Template.instance().state.get("groups");
    return group;
=======
    return Template.instance().state.get("groups");
>>>>>>> develop
  },

  messages() {
    const introMessages = [
      "This is your core settings",
      "Below is your utilities settings",
      "Followed next when you scroll is your appearance settings",
      "Scroll next is your connect settings",
      "And finally your payment method settings"
    ];

    return introMessages;
  },

  appsInGroup(groupName) {
    const group = Template.instance().state.get("appsByGroup") || {};
    return group[groupName] || false;
  },

  shopId() {
    return Reaction.getShopId();
  },


  pkgPermissions
});

Template.packagesGridGroup.helpers({
  pkgPermissions,

  packageProps(app) {
    return {
      package: app,
      enablePackage(reactionPackage, value) {
        if (value === true) {
          enableReactionPackage(reactionPackage);
        } else {
          disableReactionPackage(reactionPackage);
        }
      }
    };
  }
});

Template.registerHelper("groupIndex", function (i) {
  return i + 14;
});

<<<<<<< HEAD
Template.registerHelper("introMsg", function (msg, i) {
=======
Template.registerHelper('introMsg', function(msg, i){
>>>>>>> develop
  return msg[i];
});
