{
  function exports() {
    var Role = require('../../models/role'),
      Permissions = require('../../enum/permissions');

    var service = {
      getPermissionsForRole,
      addPermissionToRole,
      addAllPermissionsToRole
    }

    function getPermissionsForRole(roleId, cb) {
      Role.find({
        roleId: roleId
      }, (err, roles) => {
        if (err)
          return console.error(err);
        var role = roles[0];
        cb(role.permissions);
      })
    }

    function addPermissionToRole(req, res, next) {
      var permission = Permissions.get(parseInt(req.params.permissionId));

      Role.findOneAndUpdate({
        roleId: req.params.roleId
      }, {
        $addToSet: {
          'permissions': {
            key: permission.key,
            value: permission.value
          }
        }
      }, {
        upsert: true
      }, function(err, data) {
        if (err)
          console.error(err);

        res.locals.role = data;
        next();
      });

    }

    function addAllPermissionsToRole(req, res, next) {
      var permissions = [];
      Permissions.enums.forEach((permission) => {
        let p = {
          key: permission.key,
          value: permission.value
        }
        permissions.push(p)
      })

      Role.findOneAndUpdate({
        roleId: req.params.roleId
      }, {
        $addToSet: {
          permissions: {
            $each: permissions
          }
        }
      }, {
        upsert: true
      }, function(err, data) {
        if (err)
          console.error(err);

        res.locals.role = data;
        next();
      });

    }

    return service;
  }

  module.exports = exports;
}
