module.exports = function(controller) {


    if (!controller.storage || !controller.storage.user || !controller.storage.user.linked_to_haystack) {
      console.log("no link to haystack!");
    }

}
