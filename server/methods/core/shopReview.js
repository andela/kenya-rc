import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/server/api";
import { Reviews } from "/lib/collections";

/**
 * @method checkUserPermissions
 * @private
 * @summary Perform check to see if user is owner or admin
 * @return {Boolean} - check user permission status
 */
const canReview = () => {
  return !Reaction.hasOwnerAccess() &&
         !Reaction.hasAdminAccess() &&
         Reaction.hasPermission("account/profile");
};

Meteor.methods({
  "shopReview/createReview": (shopId, review, rating) => {
    check(shopId, String);
    check(review, String);
    check(rating, Number);

    if (!canReview()) {
      throw new Meteor.Error(
        403, "Owners, admins, and unauthenticated users can't review shops."
      );
    }

    const user = Meteor.user();

    const userName = user.profile.addressBook ?
      user.profile.addressBook.fullName : "";

    Reviews.insert({
      userId: user._id, shopId, email: user.emails[0].address, name: userName,
      productId: null, review, rating: parseInt(rating, 10)
    });
  }
});
