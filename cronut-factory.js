(function () {
  var CronutFactory = {};

  /**
   * Loads the arc custom Attribute in a raphael instance
   *
   * @param  {Raphael} raphael
   */
  function loadArc(raphael) {
    raphael.customAttributes.arc = function (xloc, yloc, value, total, R) {
      var alpha = 360 / total * value,
          a = (90 - alpha) * Math.PI / 180,
          x = xloc + R * Math.cos(a),
          y = yloc - R * Math.sin(a),
          path;

      if (total == value) {
        path = [
          ['M', xloc, yloc - R],
          ['A', R, R, 0, 1, 1, xloc - 0.01, yloc - R]
        ];
      } else {
        path = [
          ['M', xloc, yloc - R],
          ['A', R, R, 0, +(alpha > 180), 1, x, y]
        ];
      }
      return {
        path: path
      };
    };
  }

  /**
   * Creates a cronut base element
   *
   * @param  {Raphael} raphael
   * @param  {Object} options
   * @return {Object}
   */
  function cronutBase(raphael, options) {
    loadArc(raphael);

    var cronut_base = {}
      , position_x   = options.position_x
      , position_y   = options.position_y
      , total        = options.total
      , radius       = options.radius
      , stroke       = options.stroke
      , stroke_width = options.stroke_width
      , gutter       = options.gutter;

    function arc(part) {
      return [position_x, position_y, part, total, radius];
    }

    cronut_base.arcAnimation = function (animation_options) {
      var arch
        , from = animation_options.from
        , to = animation_options.to
        , css_class = animation_options.css_class;

      arch = raphael.path().attr({
        'stroke'       : animation_options.stroke || stroke || '#FF0000'
      , 'stroke-width' : animation_options.stroke_width || stroke_width || 1
      , 'arc'          : arc(0)
      });

      if (from > 0) {
        arch.rotate(
          (from / total) * 360
        , position_x
        , position_y
        );
      }

      if (gutter) {
        from = from + (total * gutter / 100);
        to = to - (total * gutter / 100);
      }

      if (css_class) {
        arch.node.setAttribute('class', css_class);
      }

      arch.animate({arc: arc(to - from)}, 500);
    };

    return cronut_base;
  }

  /**
   * Creates a Cronut
   *
   * @param  {Object} options
   */
  CronutFactory.create = function (options) {
    var total = 0
      , archs = options.archs
      , acc = 0
      , cronut, raphael, i, arch, value;

    raphael = new Raphael(
      options.container
    , options.width
    , options.height
    );

    for (i = 0; i < archs.length; i++) {
      total += archs[i].value;
    }

    cronut = cronutBase(raphael, {
      stroke       : options.stroke
    , stroke_width : options.stroke_width
    , position_x   : options.width / 2
    , position_y   : options.height / 2
    , radius       : options.radius
    , gutter       : options.gutter
    , total        : total
    });

    for (i = 0; i < archs.length; i++) {
      arch  = archs[i];
      value = arch.value;

      cronut.arcAnimation({
        from         : acc
      , to           : acc + value
      , stroke       : arch.stroke
      , stroke_width : arch.stroke_width
      , css_class    : arch.css_class
      });

      acc += value;
    }
  };

  this.CronutFactory = CronutFactory;
})();
