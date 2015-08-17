/*!
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=156c5fda0d7613b772c9)
 * Config saved to config.json and https://gist.github.com/156c5fda0d7613b772c9
 */
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.4
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.4'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.4'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.4'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.4'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $(document.body).height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.4
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.4'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.4
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.4'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.4
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

$(document).ready(function() {

  $('input').each(function() {

    $(this).on('focus', function() {
      $(this).parent('.float-pattern').addClass('active');
    });

    $(this).on('blur', function() {
      if ($(this).val().length == 0) {
        $(this).parent('.float-pattern').removeClass('active');
      }
    });

    if ($(this).val() != '') $(this).parent('.float-pattern').addClass('active');

  });

});
/*
 * Boxer [Formstone Library]
 * @author Ben Plum
 * @version 1.7.2
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if (jQuery) (function($) {
	
	// Default Options
	var options = {
		callback: $.noop,
		customClass: "",
		duration: 250,
		fixed: false,
		formatter: $.noop,
		height: 100,
		margin: 100,
		minHeight: 200,
		minWidth: 200,
		opacity: 0.75,
		retina: false,
		requestKey: "boxer",
		top: 0,
		videoRatio: 9 / 16,
		videoWidth: 600,
		width: 100
	};
	// Internal Data
	var data = {},
		resizeTimer = null;
	
	// Mobile Detect
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( (navigator.userAgent||navigator.vendor||window.opera) );
	
	// Public Methods
	var pub = {
		
		destroy: function() {
			_close();
			return $(this).off(".boxer");
		},
		
		resize: function(e, height, width) {
			if (typeof data.$boxer != "undefined") {
				if (data.type == "element") {
					_sizeContent(data.$content.find(">:first-child"));
				} else if (data.type == "image") {
					_sizeImage(1);
				} else if (data.type == "video") {
					_sizeVideo();
				}
				_open();
			}
			
			return $(this);
		}
	};
	
	// Initialize
	function _init(opts) {
		options.formatter = _formatCaption;
		return $(this).on("click.boxer", $.extend({}, options, opts || {}), _build);
	}
	
	// Build Boxer
	function _build(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Check target type
		var $target = $(this),
			$object = e.data.$object,
			source = ($target[0].attributes) ? $target.attr("href") || "" : "",
			checkExt = source.toLowerCase().split("."),
			extension = checkExt[ checkExt.length - 1 ],
			type = $target.data("type") || "";
		
		var isImage    = ( (type == "image") || (extension == "jpeg" || extension == "jpg" || extension == "gif" || extension == "png" || source.substr(0, 10) == "data:image") ),
			isVideo    = ( source.indexOf("youtube.com/embed") > -1 || source.indexOf("player.vimeo.com/video") > -1 ),
			isUrl 		= ( (type == "url") || (!isImage && !isVideo && source.substr(0, 4) == "http") ),
			isElement  = ( (type == "element") || (!isImage && !isVideo && !isUrl && source.substr(0, 1) == "#") ),
			isObject   = ( (typeof $object !== "undefined") );
		
		// Check if one already exists
		if ($("#boxer").length < 1 && (isImage || isVideo || isUrl || isElement || isObject)) {
			// Cache internal data
			data = {
				$target: $target,
				$object: $object,
				gallery: {
					active: false
				},
				options: e.data,
				isMobile: (isMobile /* && !isUrl */ && !isElement && !isObject)
			};
			
			if (isImage) {
				data.type = "image";
			} else if (isVideo) {
				data.type = "video";
			} else {
				data.type = "element";
			}
			
			if (isImage || isVideo) {
				// Check for gallery
				var rel = data.$target.attr("rel");
				if (typeof rel !== "undefined" && rel !== false) {
					data.gallery.active = true;
					data.gallery.rel = rel;
					data.gallery.$items = $("a[rel= " + data.gallery.rel + "]");
					data.gallery.index = data.gallery.$items.index(data.$target);
					data.gallery.total = data.gallery.$items.length - 1;
				}
			}
			
			// Assemble HTML
			var html = '';
			if (!data.isMobile) {
				html += '<div id="boxer-overlay" class="' + data.options.customClass + '" style="opacity: 0"></div>';
			}
			html += '<div id="boxer" class="' + data.options.customClass;
			if (data.isMobile) {
				html += ' mobile';
			}
			if (isUrl) {
				html += ' iframe';
			}
			if (isElement || isObject) {
				html += ' inline';
			}
			html += '" style="opacity: 0;';
			if (data.options.fixed === true) {
				html += ' position: fixed;'
			}
			html += '">';
			html += '<span class="boxer-close"><i class="icon-remove-sign"></i></span>';
			html += '<div class="boxer-container" style="opacity: 0; height: ' + data.options.height + 'px; width: ' + data.options.width + 'px">';
			html += '<div class="boxer-content">';
			if (isImage || isVideo) {
				html += '<div class="boxer-meta">';
				
				if (data.gallery.active) {
					html += '<div class="boxer-arrow previous"><i class="icon-caret-left"></i></div>';
					html += '<div class="boxer-arrow next"><i class="icon-caret-right"></i></div>';
					html += '<p class="boxer-position"';
					if (data.gallery.total < 1) { 
						html += ' style="display: none;"'; 
					}
					html += '>';
					html += '<span class="current">' + (data.gallery.index + 1) + '</span> of <span class="total">' + (data.gallery.total + 1) + '</span>';
					html += '</p>';
					html += '<div class="boxer-caption gallery">';
				} else {
					html += '<div class="boxer-caption">';
				}
				
				html += data.options.formatter.apply($("body"), [data.$target]);
				html += '</div></div>'; // caption, meta
			}
			html += '</div></div></div>'; //container, content, boxer
			
			// Modify Dom
			$("body").append(html);
			
			// Cache jquery objects
			data.$overlay = $("#boxer-overlay");
			data.$boxer = $("#boxer");
			data.$container = data.$boxer.find(".boxer-container");
			data.$content = data.$boxer.find(".boxer-content");
			data.$meta = data.$boxer.find(".boxer-meta");
			data.$position = data.$boxer.find(".boxer-position");
			data.$caption = data.$boxer.find(".boxer-caption");
			data.$arrows = data.$boxer.find(".boxer-arrow");
			data.$animatables = $("#boxer-overlay, #boxer, .boxer-container");
			data.padding = parseInt(data.$boxer.css("paddingTop"), 10) * 2;
			
			// Center / update gallery
			_center();
			if (data.gallery.active) {
				_updatePagination();
			}
			
			// Bind events
			$(window).on("resize.boxer", _resize)
					 .on("keydown.boxer", _keypress);
			$("body").on("click.boxer", "#boxer-overlay, #boxer .boxer-close", _close);
			if (data.gallery.active) {
				data.$boxer.on("click.boxer", ".boxer-arrow", _advanceGallery);
			}
			
			data.$overlay.stop().animate({ opacity: data.options.opacity }, data.options.duration);
			data.$boxer.stop().animate({ opacity: 1 }, data.options.duration, function() { 
				if (isImage) {
					_loadImage(source);
				} else if (isVideo) {
					_loadVideo(source);
				} else if (isUrl) {
					_loadURL(source);
				} else if (isElement) {
					_cloneElement(source);
				} else if (isObject) {
					_appendObject(data.$object);
				} else {
					$.error("BOXER: '" +  source + "' is not valid.");
				}
			});
		}
		if (isObject) {
			return data.$boxer;
		}
	}
	
	// Open boxer
	function _open() {
		if (data.isMobile) {
			var newLeft = 0;
				newTop = 0;
		} else {
			var newLeft = ($(window).width() - data.contentWidth - data.padding) / 2,
				newTop = (data.options.top <= 0) ? (($(window).height() - data.contentHeight - data.padding) / 2) : data.options.top,
				arrowHeight = data.$arrows.outerHeight();
			
			if (data.options.fixed !== true) {
				newTop += $(window).scrollTop();
			}
			
			data.$arrows.css({ 
				marginTop: ((data.contentHeight - data.metaHeight - arrowHeight) / 2) 
			});
		}
		
		data.$boxer.stop().animate({ left: newLeft, top: newTop }, data.options.duration);
		data.$container.show().stop().animate({ height: data.contentHeight, width: data.contentWidth }, data.options.duration, function(e) {
			data.$container.stop().animate({ opacity: 1 }, data.options.duration);
			data.$boxer.find(".boxer-close").stop().animate({ opacity: 1 }, data.options.duration);
			
			// Fire callback
			data.options.callback.apply(data.$boxer);
		});
	}
	
	// Close boxer
	function _close(e) {
		if (e.preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
		
		if (typeof data.$animatables !== "undefined") {
			data.$animatables.stop().animate({ opacity: 0 }, data.options.duration, function() {
				$(this).remove();
			});
			
			clearTimeout(resizeTimer);
			resizeTimer = null;
			
			// Clean up
			$(window).off(".boxer")
			$("body").off(".boxer");
			if (data.gallery.active) {
				data.$boxer.off(".boxer");
			}
			data = {};
		}
	}
	
	// Debounce resize events
	function _resize() {
		if (!data.isMobile) {
			if (resizeTimer !== null) {
				clearTimeout(resizeTimer);
				resizeTimer = null;
			}
			resizeTimer = setTimeout(function() { _center() }, 10);
		}
	}
	
	// Center boxer on resize
	function _center() {
		if (data.isMobile) {
			var newLeft = 0,
				newTop  = 0;
		} else {
			var newLeft = ($(window).width() - data.$boxer.width() - data.padding) / 2,
				newTop  = (data.options.top <= 0) ? (($(window).height() - data.$boxer.height() - data.padding) / 2) : data.options.top;
			
			if (data.options.fixed !== true) {
				newTop += $(window).scrollTop();
			}
		}
		
		data.$boxer.css({ 
			left: newLeft, 
			top:  newTop 
		});
	}
	
	// Load new image
	function _loadImage(source) {
		// Cache current image
		data.$image = $("<img />");
		
		data.$image.one("load.boxer", function() {
			data.naturalHeight = data.$image[0].naturalHeight;
			data.naturalWidth = data.$image[0].naturalWidth;
			
			if (data.options.retina) {
				data.naturalHeight /= 2;
				data.naturalWidth /= 2;
			}
			
			data.$content.prepend(data.$image);
			if (data.$caption.html() == "") { 
				data.$caption.hide(); 
			} else { 
				data.$caption.show(); 
			}
			
			// Size content to be sure it fits the viewport
			if (_sizeImage(0)) {
				_open();
			}
		}).attr("src", source)
		  .addClass("boxer-image");
		
		// If image has already loaded into cache, trigger load event
		if (data.$image[0].complete) {
			data.$image.trigger("load");
		}
	}
	
	// Load new video
	function _loadVideo(source) {
		data.$videoWrapper = $('<div class="boxer-video-wrapper" />');
		data.$video = $('<iframe class="boxer-video" />');
		
		data.$video.attr("src", source)
				   .addClass("boxer-video")
				   .prependTo(data.$videoWrapper);
		
		data.$content.prepend(data.$videoWrapper);
		
		_sizeVideo();
		
		_open();
	}
	
	// Format caption
	function _formatCaption($target) {
		var title = $target.attr("title");
		return (title != "" && title !== undefined) ? '<p class="caption">' + title + '</p>' : "";
	}
	
	// Resize image to fit in viewport
	function _sizeImage(count) {
		data.windowHeight = data.viewportHeight = (count == 0) ? $(window).height() : data.windowHeight;
		data.windowWidth  = data.viewportWidth = (count == 0) ? $(window).width() : data.windowWidth;
		
		data.imageHeight  = (count == 0) ? data.naturalHeight : data.$image.outerHeight();
		data.imageWidth   = (count == 0) ? data.naturalWidth : data.$image.outerWidth();
		data.metaHeight   = (count == 0) ? 0 : data.metaHeight;
		
		if (count == 0) {
			data.ratioHorizontal = data.imageHeight / data.imageWidth;
			data.ratioVertical   = data.imageWidth / data.imageHeight;
			
			data.isWide = (data.imageWidth > data.imageHeight);
		}
		
		// Double check min and max
		if (data.imageHeight < data.options.minHeight) {
			data.options.minHeight = data.imageHeight;
		}
		if (data.imageWidth < data.options.minWidth) {
			data.options.minWidth = data.imageWidth;
		}
		
		if (data.isMobile) {
			data.viewportHeight -= data.padding;
			data.viewportWidth  -= data.padding;
			
			data.contentHeight = data.viewportHeight;
			data.contentWidth  = data.viewportWidth;
			
			data = _fitImage(data); 
			
			data.imageMarginTop  = (data.contentHeight - data.targetImageHeight) / 2;
			data.imageMarginLeft = (data.contentWidth - data.targetImageWidth) / 2;
		} else {
			data.viewportHeight -= data.options.margin + data.padding + data.metaHeight;
			data.viewportWidth  -= data.options.margin + data.padding;
			
			data = _fitImage(data);
			
			data.contentHeight = data.targetImageHeight;
			data.contentWidth  = data.targetImageWidth;
			
			data.imageMarginTop = 0;
			data.imageMarginLeft = 0;
		}
		
		// Modify DOM
		data.$content.css({ 
			height: (data.isMobile) ? data.contentHeight : "auto",
			width: data.contentWidth 
		});
		data.$meta.css({ 
			width: data.contentWidth 
		});
		data.$image.css({ 
			height: data.targetImageHeight, 
			width: data.targetImageWidth,
			marginTop:  data.imageMarginTop,
			marginLeft: data.imageMarginLeft
		});
		
		if (!data.isMobile) {
			data.metaHeight = data.$meta.outerHeight(true);
			data.contentHeight += data.metaHeight;
			
			if (data.contentHeight > data.viewportHeight && count < 2) {
				return _sizeImage(count+1);
			}
		}
		
		return true;
	}
	
	// Fit image to viewport
	function _fitImage(data) {
		if (data.isWide) {
			//WIDE
			data.targetImageWidth  = data.viewportWidth;
			data.targetImageHeight = data.targetImageWidth * data.ratioHorizontal;
			
			if (data.targetImageHeight > data.viewportHeight) {
				data.targetImageHeight = data.viewportHeight;
				data.targetImageWidth  = data.targetImageHeight * data.ratioVertical;
			}
		} else {
			//TALL
			data.targetImageHeight = data.viewportHeight;
			data.targetImageWidth = data.targetImageHeight * data.ratioVertical;
			
			if (data.targetImageWidth > data.viewportWidth) {
				data.targetImageWidth = data.viewportWidth;
				data.targetImageHeight = data.targetImageWidth * data.ratioHorizontal;
			}
		}
		
		// MAX
		if (data.targetImageWidth > data.imageWidth || data.targetImageHeight > data.imageHeight) {
			data.targetImageWidth = data.imageWidth;
			data.targetImageHeight = data.imageHeight;
		}
		
		// MIN
		if (data.targetImageWidth < data.options.minWidth || data.targetImageHeight < data.options.minHeight) {
			if (data.imageWidth > data.imageHeight) {
				data.targetImageHeight = data.options.minHeight;
				data.targetImageWidth = data.targetImageHeight * data.ratioHorizontal;
			} else {
				data.targetImageWidth = data.options.minWidth;
				data.targetImageHeight = data.tagretImageWidth * data.ratioVertical;
			}
		}
		
		return data;
	}
	
	// Resize image to fit in viewport
	function _sizeVideo() {
		data.windowHeight = $(window).height() - data.padding;
		data.windowWidth  = $(window).width() - data.padding;
		data.videoMarginTop = 0;
		data.videoMarginLeft = 0;
		
		if (data.isMobile) {
			data.$meta.css({ 
				width: data.windowWidth
			});
			data.metaHeight = data.$meta.outerHeight(true);
			
			data.contentHeight = data.windowHeight;
			data.contentWidth  = data.windowWidth;
			
			data.videoWidth  = data.windowWidth;
			data.videoHeight = data.videoWidth * data.options.videoRatio;
			
			if (data.videoHeight > data.windowHeight - data.metaHeight) {
				data.videoHeight = data.windowHeight - data.metaHeight;
				data.videoWidth  = data.videoHeight * data.options.videoRatio;
			}
			
			data.videoMarginTop = (data.contentHeight - data.videoHeight) / 2;
			data.videoMarginLeft = (data.contentWidth - data.videoWidth) / 2;
		} else {
			data.windowHeight -= data.options.margin;
			data.windowWidth  -= data.options.margin;
			
			data.videoWidth  = (data.options.videoWidth > data.windowWidth) ? data.windowWidth : data.options.videoWidth;
			data.videoHeight = data.videoWidth * data.options.videoRatio;
			
			data.contentHeight = data.videoHeight;
			data.contentWidth  = data.videoWidth;
		}
		
		data.$content.css({ 
			height: (data.isMobile) ? data.contentHeight : "auto",
			width: data.contentWidth 
		});
		data.$meta.css({ 
			width: data.contentWidth 
		});
		data.$videoWrapper.css({ 
			height: data.videoHeight, 
			width: data.videoWidth,
			marginTop: data.videoMarginTop,
			marginLeft: data.videoMarginLeft
		});
		
		if (!data.isMobile) {
			data.metaHeight = data.$meta.outerHeight(true);
			data.contentHeight = data.videoHeight + data.metaHeight;
		}
		data.contentWidth  = data.videoWidth;
	}
	
	// Advance gallery
	function _advanceGallery(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Click target
		var $arrow = $(this);
		
		if (!$arrow.hasClass("disabled")) {
			data.gallery.index += ($arrow.hasClass("next")) ? 1 : -1;
			if (data.gallery.index > data.gallery.total) {
				data.gallery.index = data.gallery.total;
			}
			if (data.gallery.index < 0) {
				data.gallery.index = 0;
			}
			
			data.$container.stop().animate({opacity: 0}, data.options.duration, function() {
				if (typeof data.$image !== 'undefined') {
					data.$image.remove();
				}
				if (typeof data.$videoWrapper !== 'undefined') {
					data.$videoWrapper.remove();
				}
				data.$target = data.gallery.$items.eq(data.gallery.index);
				
				data.$caption.html(data.options.formatter.apply($("body"), [data.$target]));
				data.$position.find(".current").html(data.gallery.index + 1);
				
				var source = data.$target.attr("href"),
					isVideo = ( source.indexOf("youtube.com/embed") > -1 || source.indexOf("player.vimeo.com/video") > -1 );
				
				if (isVideo) {
					_loadVideo(source);
				} else {
					_loadImage(source);
				}
				_updatePagination();
			});
		}
	}
	
	// Update galery arrows
	function _updatePagination() {
		data.$arrows.removeClass("disabled");
		if (data.gallery.index == 0) { 
			data.$arrows.filter(".previous").addClass("disabled");
		}
		if (data.gallery.index == data.gallery.total) {
			data.$arrows.filter(".next").addClass("disabled");
		}
	}
	
	// Handle keypress in gallery
	function _keypress(e) {
		if (data.gallery.active && (e.keyCode == 37 || e.keyCode == 39)) {
			e.preventDefault();
			e.stopPropagation();
			
			data.$arrows.filter((e.keyCode == 37) ? ".previous" : ".next").trigger("click");
		} else if (e.keyCode == 27) {
			data.$boxer.find(".boxer-close").trigger("click");
		}
	}
	
	// Clone inline element
	function _cloneElement(id) {
		var $clone = $(id).find(">:first-child").clone();
		_appendObject($clone);
	}
	
	// Load URL into iFrame
	function _loadURL(source) {
		source = source + ((source.indexOf("?") > -1) ? "&"+options.requestKey+"=true" : "?"+options.requestKey+"=true");
		var $iframe = $('<iframe class="boxer-iframe" src="' + source + '" />');
		_appendObject($iframe);
	}
	
	// Append jQuery object
	function _appendObject($obj) {
		data.$content.append($obj);
		_sizeContent($obj);
		_open();
	}
	
	// Size jQuery object
	function _sizeContent($object) {
		data.objectHeight     = $object.outerHeight(true),
		data.objectWidth      = $object.outerWidth(true),
		data.windowHeight     = $(window).height() - data.padding,
		data.windowWidth      = $(window).width() - data.padding,
		data.dataHeight       = data.$target.data("height"),
		data.dataWidth        = data.$target.data("width"),
		data.maxHeight        = (data.windowHeight < 0) ? options.minHeight : data.windowHeight,
		data.isIframe         = $object.is("iframe");
		data.objectMarginTop  = 0;
		data.objectMarginLeft = 0;
			
		if (!data.isMobile) {
			data.windowHeight -= data.options.margin;
			data.windowWidth  -= data.options.margin;
		}
		
		data.contentHeight = (data.dataHeight != undefined && !data.isIframe) ? data.dataHeight : (data.isIframe) ? data.windowHeight : data.objectHeight;
		data.contentWidth  = (data.dataWidth != undefined && !data.isIframe)  ? data.dataWidth  : (data.isIframe) ? data.windowWidth  : data.objectWidth;
		
		if (data.contentHeight > data.maxHeight) {
			data.contentHeight = data.maxHeight;
			if (!data.isIframe) {
				data.$content.css({ 
					overflowY: "scroll" 
				});
			}
		} else {
			data.$content.css({ 
				overflowY: "auto" 
			});
		}
		
		data.$content.css({ 
			height: data.contentHeight, 
			width:  data.contentWidth
		});
	}
	
	// Define Plugin
	$.fn.boxer = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;	
	};
	
	$.boxer = function($target, opts) {
		return _build($.Event("click", { data: $.extend({
			$object: $target
		}, options, opts || {}) }));
	}
})(jQuery);
/* 
 * Wallpaper v3.1.5 - 2014-04-10 
 * A jQuery plugin for smooth-scaling image and video backgrounds. Part of the Formstone Library. 
 * http://formstone.it/wallpaper/ 
 * 
 * Copyright 2014 Ben Plum; MIT Licensed 
 */ 

;(function ($, window) {
	"use strict";

	var $window = $(window),
		$body,
		$responders = null,
		nativeSupport = ("backgroundSize" in document.documentElement.style),
		guid = 0,
		youTubeReady = false,
		youTubeQueue = [],
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( (window.navigator.userAgent||window.navigator.vendor||window.opera) ),
		transitionEvent,
		transitionSupported;

	/**
	 * @options
	 * @param autoPlay [boolean] <true> "Autoplay video"
	 * @param embedRatio [number] <1.777777> "Video / embed ratio (16/9)"
	 * @param hoverPlay [boolean] <false> "Play video on hover"
	 * @param loop [boolean] <true> "Loop video"
	 * @param mute [boolean] <true> "Mute video"
	 * @param onLoad [function] <$.noop> "On load callback"
	 * @param onReady [function] <$.noop> "On ready callback"
	 * @param source [string | object] <null> "Source image (string) or video (object)"
	 */
	var options = {
		autoPlay: true,
		embedRatio: 1.777777,
		hoverPlay: false,
		loop: true,
		mute: true,
		onLoad: $.noop,
		onReady: $.noop,
		source: null
	};

	/**
	 * @events
	 * @event wallpaper.loaded "Source media loaded"
	 */

	var pub = {

		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.wallpaper("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return $(this);
		},

		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $(".target").wallpaper("destroy");
		 */
		destroy: function() {
			var $targets = $(this).each(function() {
				var data = $(this).data("wallpaper");

				if (data) {
					data.$container.remove();
					data.$target.removeClass("wallpaper")
								.off(".boxer")
								.data("wallpaper", null);
				}
			});

			if ($(".wallpaper").length < 1) {
				$body.removeClass("wallpaper-inititalized");
				$window.off(".wallpaper");
			}

			return $targets;
		},

		/**
		 * @method
		 * @name load
		 * @description Loads source media
		 * @param source [string | object] "Source image (string) or video (object)"
		 * @example $(".target").wallpaper("load", "path/to/image.jpg");
		 */
		load: function(source) {
			return $(this).each(function() {
				var data = $(this).data("wallpaper");

				if (data) {
					_loadMedia(source, data);
				}
			});
		},

		/**
		 * @method
		 * @name pause
		 * @description Pauses target video
		 * @example $(".target").wallpaper("stop");
		 */
		pause: function() {
			return $(this).each(function() {
				var data = $(this).data("wallpaper");

				if (data) {
					if (data.isYouTube && data.player) {
						data.player.pauseVideo();
					} else {
						var $video = data.$container.find("video");

						if ($video.length) {
							$video[0].pause();
						}
					}
				}
			});
		},

		/**
		 * @method
		 * @name play
		 * @description Plays target video
		 * @example $(".target").wallpaper("play");
		 */
		play: function() {
			return $(this).each(function() {
				var data = $(this).data("wallpaper");

				if (data) {
					if (data.isYouTube && data.player) {
						data.player.playVideo();
					} else {
						var $video = data.$container.find("video");

						if ($video.length) {
							$video[0].play();
						}
					}
				}
			});
		},

		/**
		 * @method private
		 * @name stop
		 * @description Deprecated; Aliased to "pause"
		 * @example $(".target").wallpaper("stop");
		 */
		stop: function() {
			pub.pause.apply(this);
		},

		/**
		 * @method
		 * @name unload
		 * @description Unloads current media
		 * @example $(".target").wallpaper("unload");
		 */
		unload: function() {
			return $(this).each(function() {
				var data = $(this).data("wallpaper");

				if (data) {
					_unloadMedia(data);
				}
			});
		}
	};

	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin instances
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		var data = $.extend({}, options, opts);

		$body = $("body");
		transitionEvent = _getTransitionEvent();
		transitionSupported = (transitionEvent !== false);

		// no transitions :(
		if (!transitionSupported) {
			transitionEvent = "transitionend.wallpaper";
		}

		// Apply to each
		var $targets = $(this);
		for (var i = 0, count = $targets.length; i < count; i++) {
			_build.apply($targets.eq(i), [ $.extend({}, data) ]);
		}

		// Global events
		if (!$body.hasClass("wallpaper-inititalized")) {
			$body.addClass("wallpaper-inititalized");
			$window.on("resize.wallpaper", data, _onResizeAll);
		}

		// Maintain chainability
		return $targets;
	}

	/**
	 * @method private
	 * @name _build
	 * @description Builds each instance
	 * @param data [object] "Instance data"
	 */
	function _build(data) {
		var $target = $(this);
		if (!$target.hasClass("wallpaper")) {
			$.extend(data, $target.data("wallpaper-options"));

			$target.addClass("wallpaper loading")
				   .append('<div class="wallpaper-container"></div>');

			data.guid = "wallpaper-" + (guid++);
			data.$target = $target;
			data.$container = data.$target.find(".wallpaper-container");

			// Bind data & events
			data.$target.data("wallpaper", data)
						.on("resize.wallpaper", data, _onResize);

			var source = data.source;
			data.source = null;

			_loadMedia(source, data, true);

			data.onReady.call();
		}
	}

	/**
	 * @method private
	 * @name _loadMedia
	 * @description Determines how to handle source media
	 * @param source [string | object] "Source image (string) or video (object)"
	 * @param data [object] "Instance data"
	 * @param firstLoad [boolean] "Flag for first load"
	 */
	function _loadMedia(source, data, firstLoad) {
		// Check if the source is new
		if (data.source !== source) {
			data.source = source;

			// Check YouTube
			if (typeof source === "string") {
				// var parts = source.match( /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/ );
				var parts = source.match( /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i );
				data.isYouTube = (parts && parts.length >= 1);
			}

			if (data.isYouTube) {
				data.playing = false;
				data.posterLoaded = false;

				_loadYouTube(source, data, firstLoad);
			} else if (typeof source === "object" && !source.fallback) {
				_loadVideo(source, data, firstLoad);
			} else {
				// single image or responsive set
				_loadImage(source, data, false, firstLoad);
			}
		} else {
			data.$target.trigger("wallpaper.loaded");
			data.onLoad.call(data.$target);
		}
	}

	/**
	 * @method private
	 * @name _loadImage
	 * @description Loads source image
	 * @param source [string] "Source image"
	 * @param data [object] "Instance data",
	 * @param poster [boolean] "Flag for video poster"
	 */
	function _loadImage(source, data, poster, firstLoad) {
		var $imgContainer = $('<div class="wallpaper-media wallpaper-image' + ((firstLoad !== true) ? ' animated' : '') + '"><img /></div>'),
			$img = $imgContainer.find("img"),
			newSource = source;

		// Responsive image handling
		if (typeof source === "object") {
			var sources = [];
			$imgContainer.addClass("wallpaper-responsive");

			for (var i in source) {
				if (source.hasOwnProperty(i)) {
					var media = (i === "fallback") ? "(min-width: 0px)" : i;

					if (media) {
						var _mq = window.matchMedia(media.replace(Infinity, "100000px"));
						_mq.addListener(_respond);
						sources.push({
							mq: _mq,
							source: source[i]
						});

						if (_mq.matches) {
							newSource = source[i];
						}
					}
				}
			}

			$imgContainer.data("wallpaper-matches", sources);
		}

		// Load image
		$img.one("load.wallpaper", function() {
			if (nativeSupport) {
				$imgContainer.addClass("native")
							 .css({ backgroundImage: "url(" + newSource + ")" });
			}

			// Append
			$imgContainer.on(transitionEvent, function(e) {
				_killEvent(e);

				if ($(e.target).is($imgContainer)) {
					$imgContainer.off(transitionEvent);

					if (!poster) {
						_cleanMedia(data);
					}
				}
			});

			setTimeout( function() { $imgContainer.css({ opacity: 1 }); }, 0);

			// Resize
			_onResize({ data: data });

			if (!poster || firstLoad) {
				data.$target.trigger("wallpaper.loaded");
				data.onLoad.call(data.$target);
			}
		}).attr("src", newSource);

		data.$container.append($imgContainer);

		// caches responsive images
		$responders = $(".wallpaper-responsive");

		// Check if image is cached
		if ($img[0].complete || $img[0].readyState === 4) {
			$img.trigger("load.wallpaper");
		}
	}

	/**
	 * @method private
	 * @name _loadVideo
	 * @description Loads source video
	 * @param source [object] "Source video"
	 * @param data [object] "Instance data"
	 */
	function _loadVideo(source, data, firstLoad) {
		if (data.source.poster) {
			_loadImage(data.source.poster, data, true, true);

			firstLoad = false;
		}

		if (!isMobile) {
			var html = '<div class="wallpaper-media wallpaper-video' + ((firstLoad !== true) ? ' animated' : '') +'">';
			html += '<video';
			if (data.loop) {
				html += ' loop';
			}
			if (data.mute) {
				html += ' muted';
			}
			html += '>';
			if (data.source.webm) {
				html += '<source src="' + data.source.webm + '" type="video/webm" />';
			}
			if (data.source.mp4) {
				html += '<source src="' + data.source.mp4 + '" type="video/mp4" />';
			}
			if (data.source.ogg) {
				html += '<source src="' + data.source.ogg + '" type="video/ogg" />';
			}
			html += '</video>';
			html += '</div>';

			var $videoContainer = $(html),
				$video = $videoContainer.find("video");

			$video.one("loadedmetadata.wallpaper", function(e) {
				$videoContainer.on(transitionEvent, function(e) {
					_killEvent(e);

					if ($(e.target).is($videoContainer)) {
						$videoContainer.off(transitionEvent);

						_cleanMedia(data);
					}
				});

				setTimeout( function() { $videoContainer.css({ opacity: 1 }); }, 0);

				// Resize
				_onResize({ data: data });

				data.$target.trigger("wallpaper.loaded");
				data.onLoad.call(data.$target);

				// Events
				if (data.hoverPlay) {
					data.$target.on("mouseover.boxer", pub.play)
								.on("mouseout.boxer", pub.pause);
				} else if (data.autoPlay) {
					this.play();
				}
			});

			data.$container.append($videoContainer);
		}
	}

	/**
	 * @method private
	 * @name _loadYouTube
	 * @description Loads YouTube video
	 * @param source [string] "YouTube URL"
	 * @param data [object] "Instance data"
	 */
	function _loadYouTube(source, data, firstLoad) {
		if (!data.videoId) {
			var parts = source.match( /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/ );
			data.videoId = parts[1];
		}

		if (!data.posterLoaded) {
			if (!data.poster) {
				// data.poster = "http://img.youtube.com/vi/" + data.videoId + "/maxresdefault.jpg";
				data.poster = "http://img.youtube.com/vi/" + data.videoId + "/0.jpg";
			}

			data.posterLoaded = true;
			_loadImage(data.poster, data, true, firstLoad);

			firstLoad = false;
		}

		if (!isMobile) {
			if (!$("script[src*='www.youtube.com/iframe_api']").length) {
				$("head").append('<script src="' + window.location.protocol + '//www.youtube.com/iframe_api"></script>');
			}

			if (!youTubeReady) {
				youTubeQueue.push({
					source: source,
					data: data
				});
			} else {
				var html = '<div class="wallpaper-media wallpaper-embed' + ((firstLoad !== true) ? ' animated' : '') + '">';
				html += '<iframe id="' + data.guid + '" type="text/html" src="';
				// build fresh source
				html += window.location.protocol + "//www.youtube.com/embed/" + data.videoId + "/";
				html += '?controls=0&rel=0&showinfo=0&enablejsapi=1&version=3&playerapiid=' + data.guid;
				if (data.loop) {
					//html += '&loop=1&playlist=' + data.videoId;
					html += '&loop=1';
				}
				// youtube draws play button if not set to autoplay...
				html += '&autoplay=1';
				html += '&origin=' + window.location.protocol + "//" + window.location.host;
				html += '" frameborder="0" allowfullscreen></iframe>';
				html += '</div>';

				var $embedContainer = $(html);
				data.$container.append($embedContainer);

				data.player = new window.YT.Player(data.guid, {
					events: {
						onReady: function (e) {
							// Fix for Safari's overly secure security settings...
							data.$target.find(".wallpaper-embed").addClass("ready");

							data.player.setPlaybackQuality("highres");

							if (data.mute) {
								data.player.mute();
							}

							if (data.hoverPlay) {
								data.$target.on("mouseover.boxer", pub.play)
											.on("mouseout.boxer", pub.pause);
							}
						},
						onStateChange: function (e) {
							if (!data.playing && e.data === window.YT.PlayerState.PLAYING) {
								data.playing = true;

								if (data.hoverPlay || !data.autoPlay) {
									data.player.pauseVideo();
								}

								data.$target.trigger("wallpaper.loaded");
								data.onLoad.call(data.$target);

								$embedContainer.on(transitionEvent, function(e) {
									_killEvent(e);

									if ($(e.target).is($embedContainer)) {
										$embedContainer.off(transitionEvent);

										_cleanMedia(data);
									}
								});

								$embedContainer.css({ opacity: 1 });
							} else if (data.loop && data.playing && e.data === window.YT.PlayerState.ENDED) {
								// fix looping option
								data.player.playVideo();
							}
						}
					}
		        });

				// Resize
				_onResize({ data: data });
			}
		}
	}

	/**
	 * @method private
	 * @name _cleanMedia
	 * @description Cleans up old media
	 * @param data [object] "Instance data"
	 */
	function _cleanMedia(data) {
		var $mediaContainer = data.$container.find(".wallpaper-media");

		if ($mediaContainer.length >= 1) {
			$mediaContainer.not(":last").remove();
		}
	}

	/**
	 * @method private
	 * @name _uploadMedia
	 * @description Unloads current media
	 * @param data [object] "Instance data"
	 */
	function _unloadMedia(data) {
		var $mediaContainer = data.$container.find(".wallpaper-media");

		if ($mediaContainer.length >= 1) {
			$mediaContainer.on(transitionEvent, function(e) {
				_killEvent(e);

				if ($(e.target).is($mediaContainer)) {
					$(this).remove();

					delete data.source;
				}
			}).css({ opacity: 0 });
		}
	}

	/**
	 * @method private
	 * @name _onResize
	 * @description Resize target instance
	 * @param e [object] "Event data"
	 */
	function _onResize(e) {
		_killEvent(e);

		var data = e.data;

		// Target all media
		var $mediaContainers = data.$container.find(".wallpaper-media");

		for (var i = 0, count = $mediaContainers.length; i < count; i++) {
			var $mediaContainer = $mediaContainers.eq(i),
				type = (data.isYouTube) ? "iframe" : ($mediaContainer.find("video").length ? "video" : "img"),
				$media = $mediaContainer.find(type);

			// If media found and scaling is not natively support
			if ($media.length && !(type === "img" && data.nativeSupport)) {
				var frameWidth = data.$target.outerWidth(),
					frameHeight = data.$target.outerHeight(),
					frameRatio = frameWidth / frameHeight,
					naturalSize = _naturalSize(data, $media);

				data.width = naturalSize.naturalWidth;
				data.height = naturalSize.naturalHeight;
				data.left = 0;
				data.top = 0;

				var mediaRatio = (data.isYouTube) ? data.embedRatio : (data.width / data.height);

				// First check the height
				data.height = frameHeight;
				data.width = data.height * mediaRatio;

				// Next check the width
				if (data.width < frameWidth) {
					data.width = frameWidth;
					data.height = data.width / mediaRatio;
				}

				// Position the media
				data.left = -(data.width - frameWidth) / 2;
				data.top = -(data.height - frameHeight) / 2;

				$mediaContainer.css({
					height: data.height,
					width: data.width,
					left: data.left,
					top: data.top
				});
			}
		}
	}

	/**
	 * @method private
	 * @name _onResizeAll
	 * @description Resizes all target instances
	 */
	function _onResizeAll() {
		$(".wallpaper").each(function() {
			var data = $(this).data("wallpaper");
			_onResize({ data: data });
		});
	}

	/**
	 * @method private
	 * @name _respond
	 * @description Handle media query changes
	 */
	function _respond() {
		$responders.each(function() {
			var $target = $(this),
				$image = $target.find("img"),
				data = $target.parents(".wallpaper").data("wallpaper"),
				sources = $target.data("wallpaper-matches"),
				index = 0;

			for (var i = 0, count = sources.length; i < count; i++) {
				if (sources.hasOwnProperty(i)) {
					var match = sources[i].mq;

					if (match && match.matches) {
						index = i;
					}
				}
			}

			/*
			if (nativeSupport) {
				$target.css({ backgroundImage: "url(" + sources[index].source + ")" });
			} else {
				$image.attr("src", sources[index].source);
			}
			*/

			_loadImage(sources[index].source, data, false, true);

			$target.trigger("change.wallpaper");
		});
	}

	/**
	 * @method private
	 * @name _naturalSize
	 * @description Determines natural size of target media
	 * @param data [object] "Instance data"
	 * @param $media [jQuery object] "Source media object"
	 * @return [object | boolean] "Object containing natural height and width values or false"
	 */
	function _naturalSize(data, $media) {
		if (data.isYouTube) {
			return {
				naturalHeight: 500,
				naturalWidth:  500 / data.embedRatio
			};
		} else if ($media.is("img")) {
			var node = $media[0];

			if (typeof node.naturalHeight !== "undefined") {
				return {
					naturalHeight: node.naturalHeight,
					naturalWidth:  node.naturalWidth
				};
			} else {
				var img = new Image();
				img.src = node.src;
				return {
					naturalHeight: img.height,
					naturalWidth:  img.width
				};
			}
		} else {
			return {
				naturalHeight: $media[0].videoHeight,
				naturalWidth:  $media[0].videoWidth
			};
		}
		return false;
	}

	/**
	 * @method private
	 * @name _killEvent
	 * @description Prevents default and stops propagation on event
	 * @param e [object] "Event data"
	 */
	function _killEvent(e) {
		if (e.preventDefault) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	/**
	 * @method private
	 * @name _getTransitionEvent
	 * @description Retuns a properly prefixed transitionend event
	 * @return [string] "Properly prefixed event"
	 */
	function _getTransitionEvent() {
		var transitions = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition':    'transitionend',
				'OTransition':      'oTransitionEnd',
				'transition':       'transitionend'
			},
			test = document.createElement('div');

		for (var type in transitions) {
			if (transitions.hasOwnProperty(type) && type in test.style) {
				return transitions[type] + ".wallpaper";
			}
		}

		return false;
	}

	/**
	 * @method global
	 * @name window.onYouTubeIframeAPIReady
	 * @description Attaches YouTube players to active instances
	 */
	window.onYouTubeIframeAPIReady = function() {
		youTubeReady = true;

		for (var i in youTubeQueue) {
			if (youTubeQueue.hasOwnProperty(i)) {
				_loadYouTube(youTubeQueue[i].source, youTubeQueue[i].data);
			}
		}

		youTubeQueue = [];
	};

	$.fn.wallpaper = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};

	$.wallpaper = function(method) {
		if (method === "defaults") {
			pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};
})(jQuery, window);
// ----------------------------------------------------------------------------------------------------
// ScrollMe
// A jQuery plugin for adding simple scrolling effects to web pages
// http://scrollme.nckprsn.com
// ----------------------------------------------------------------------------------------------------

var scrollme = ( function( $ )
{
	// ----------------------------------------------------------------------------------------------------
	// ScrollMe object

	var _this = {};

	// ----------------------------------------------------------------------------------------------------
	// Properties

	var $document = $( document );
	var $window = $( window );

	_this.body_height = 0;

	_this.viewport_height = 0;

	_this.viewport_top = 0;
	_this.viewport_bottom = 0;

	_this.viewport_top_previous = -1;

	_this.elements = [];
	_this.elements_in_view = [];

	_this.property_defaults =
	{
		'opacity' : 1,
		'translatex' : 0,
		'translatey' : 0,
		'translatez' : 0,
		'rotatex' : 0,
		'rotatey' : 0,
		'rotatez' : 0,
		'scale' : 1,
		'scalex' : 1,
		'scaley' : 1,
		'scalez' : 1
	};

	_this.scrollme_selector = '.scrollme';
	_this.animateme_selector = '.animateme';

	_this.update_interval = 10;

	// Easing functions

	_this.easing_functions =
	{
		'linear' : function( x )
		{
			return x;
		},

		'easeout' : function( x )
		{
			return x * x * x;
		},

		'easein' : function( x )
		{
			x = 1 - x;
			return 1 - ( x * x * x );
		},

		'easeinout' : function( x )
		{
			if( x < 0.5 )
			{
				return ( 4 * x * x * x );
			}
			else
			{
				x = 1 - x;
				return 1 - ( 4 * x * x * x ) ;
			}
		}
	};

	// Document events to bind initialisation to

	_this.init_events =
	[
		'ready',
		'page:load', // Turbolinks
		'page:change' // Turbolinks
	];

	// ----------------------------------------------------------------------------------------------------
	// Initialisation conditions

	_this.init_if = function() { return true; }

	// ----------------------------------------------------------------------------------------------------
	// Initialisation

	_this.init = function()
	{
		// Cancel if initialisation conditions not met

		if( !_this.init_if() ) return false;

		// Load all elements to animate

		_this.init_elements();

		// Get element & viewport sizes

		_this.on_resize();

		// Recalculate heights & positions on resize and rotate

		$window.on( 'resize orientationchange' , function(){ _this.on_resize(); } );

		// Recalculate heights & positions when page is fully loaded + a bit just in case

		$window.load( function(){ setTimeout( function(){ _this.on_resize(); } , 100 ) });

		// Start animating

		setInterval( _this.update , _this.update_interval );

		return true;
	}

	// ----------------------------------------------------------------------------------------------------
	// Get list and pre-load animated elements

	_this.init_elements = function()
	{
		// For each reference element

		$( _this.scrollme_selector ).each( function()
		{
			var element = {};

			element.element = $( this );

			var effects = [];

			// For each animated element

			$( this ).find( _this.animateme_selector ).addBack( _this.animateme_selector ).each( function()
			{
				// Get effect details

				var effect = {};

				effect.element = $( this );

				effect.when = effect.element.data( 'when' );
				effect.from = effect.element.data( 'from' );
				effect.to = effect.element.data( 'to' );

				if( effect.element.is( '[data-crop]' ) )
				{
					effect.crop = effect.element.data( 'crop' );
				}
				else
				{
					effect.crop = true;
				}

				if( effect.element.is( '[data-easing]' ) )
				{
					effect.easing = _this.easing_functions[ effect.element.data( 'easing' ) ]
				}
				else
				{
					effect.easing = _this.easing_functions[ 'easeout' ];
				}

				// Get animated properties

				var properties = {};

				if( effect.element.is( '[data-opacity]' ) )    properties.opacity    = effect.element.data( 'opacity' );
				if( effect.element.is( '[data-translatex]' ) ) properties.translatex = effect.element.data( 'translatex' );
				if( effect.element.is( '[data-translatey]' ) ) properties.translatey = effect.element.data( 'translatey' );
				if( effect.element.is( '[data-translatez]' ) ) properties.translatez = effect.element.data( 'translatez' );
				if( effect.element.is( '[data-rotatex]' ) )    properties.rotatex    = effect.element.data( 'rotatex' );
				if( effect.element.is( '[data-rotatey]' ) )    properties.rotatey    = effect.element.data( 'rotatey' );
				if( effect.element.is( '[data-rotatez]' ) )    properties.rotatez    = effect.element.data( 'rotatez' );
				if( effect.element.is( '[data-scale]' ) )      properties.scale      = effect.element.data( 'scale' );
				if( effect.element.is( '[data-scalex]' ) )     properties.scalex     = effect.element.data( 'scalex' );
				if( effect.element.is( '[data-scaley]' ) )     properties.scaley     = effect.element.data( 'scaley' );
				if( effect.element.is( '[data-scalez]' ) )     properties.scalez     = effect.element.data( 'scalez' );

				effect.properties = properties;

				effects.push( effect );
			});

			element.effects = effects;

			_this.elements.push( element );
		});
	}

	// ----------------------------------------------------------------------------------------------------
	// Update elements

	_this.update = function()
	{
		window.requestAnimationFrame( function()
		{
			_this.update_viewport_position();

			if( _this.viewport_top_previous != _this.viewport_top )
			{
				_this.update_elements_in_view();
				_this.animate();
			}

			_this.viewport_top_previous = _this.viewport_top;
		});
	}

	// ----------------------------------------------------------------------------------------------------
	// Animate stuff

	_this.animate = function()
	{
		// For each element in viewport

		var elements_in_view_length = _this.elements_in_view.length;

		for( var i=0 ; i<elements_in_view_length ; i++ )
		{
			var element = _this.elements_in_view[i];

			// For each effect

			var effects_length = element.effects.length;

			for( var e=0 ; e<effects_length ; e++ )
			{
				var effect = element.effects[e];

				// Get effect animation boundaries

				switch( effect.when )
				{
					case 'view' : // Maintained for backwards compatibility
					case 'span' :
						var start = element.top - _this.viewport_height;
						var end = element.bottom;
						break;

					case 'exit' :
						var start = element.bottom - _this.viewport_height;
						var end = element.bottom;
						break;

					default :
						var start = element.top - _this.viewport_height;
						var end = element.top;
						break;
				}

				// Crop boundaries

				if( effect.crop )
				{
					if( start < 0 ) start = 0;
					if( end > ( _this.body_height - _this.viewport_height ) ) end = _this.body_height - _this.viewport_height;
				}

				// Get scroll position of reference selector

				var scroll = ( _this.viewport_top - start ) / ( end - start );

				// Get relative scroll position for effect

				var from = effect[ 'from' ];
				var to = effect[ 'to' ];

				var length = to - from;

				var scroll_relative = ( scroll - from ) / length;

				// Apply easing

				var scroll_eased = effect.easing( scroll_relative );

				// Get new value for each property

				var opacity    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'opacity' );
				var translatey = _this.animate_value( scroll , scroll_eased , from , to , effect , 'translatey' );
				var translatex = _this.animate_value( scroll , scroll_eased , from , to , effect , 'translatex' );
				var translatez = _this.animate_value( scroll , scroll_eased , from , to , effect , 'translatez' );
				var rotatex    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'rotatex' );
				var rotatey    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'rotatey' );
				var rotatez    = _this.animate_value( scroll , scroll_eased , from , to , effect , 'rotatez' );
				var scale      = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scale' );
				var scalex     = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scalex' );
				var scaley     = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scaley' );
				var scalez     = _this.animate_value( scroll , scroll_eased , from , to , effect , 'scalez' );

				// Override scale values

				if( 'scale' in effect.properties )
				{
					scalex = scale;
					scaley = scale;
					scalez = scale;
				}

				// Update properties

				effect.element.css(
				{
					'opacity' : opacity,
					'transform' : 'translate3d( '+translatex+'px , '+translatey+'px , '+translatez+'px ) rotateX( '+rotatex+'deg ) rotateY( '+rotatey+'deg ) rotateZ( '+rotatez+'deg ) scale3d( '+scalex+' , '+scaley+' , '+scalez+' )'
				} );
			}
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Calculate property values

	_this.animate_value = function( scroll , scroll_eased , from , to , effect , property )
	{
		var value_default = _this.property_defaults[ property ];

		// Return default value if property is not animated

		if( !( property in effect.properties ) ) return value_default;

		var value_target = effect.properties[ property ];

		var forwards = ( to > from ) ? true : false;

		// Return boundary value if outside effect boundaries

		if( scroll < from && forwards ) { return value_default; }
		if( scroll > to && forwards ) { return value_target; }

		if( scroll > from && !forwards ) { return value_default; }
		if( scroll < to && !forwards ) { return value_target; }

		// Calculate new property value

		var new_value = value_default + ( scroll_eased * ( value_target - value_default ) );

		// Round as required

		switch( property )
		{
			case 'opacity'    : new_value = new_value.toFixed(2); break;
			case 'translatex' : new_value = new_value.toFixed(0); break;
			case 'translatey' : new_value = new_value.toFixed(0); break;
			case 'translatez' : new_value = new_value.toFixed(0); break;
			case 'rotatex'    : new_value = new_value.toFixed(1); break;
			case 'rotatey'    : new_value = new_value.toFixed(1); break;
			case 'rotatez'    : new_value = new_value.toFixed(1); break;
			case 'scale'      : new_value = new_value.toFixed(3); break;
			default : break;
		}

		// Done

		return new_value;
	}

	// ----------------------------------------------------------------------------------------------------
	// Update viewport position

	_this.update_viewport_position = function()
	{
		_this.viewport_top = $window.scrollTop();
		_this.viewport_bottom = _this.viewport_top + _this.viewport_height;
	}

	// ----------------------------------------------------------------------------------------------------
	// Update list of elements in view

	_this.update_elements_in_view = function()
	{
		_this.elements_in_view = [];

		var elements_length = _this.elements.length;

		for( var i=0 ; i<elements_length ; i++ )
		{
			if ( ( _this.elements[i].top < _this.viewport_bottom ) && ( _this.elements[i].bottom > _this.viewport_top ) )
			{
				_this.elements_in_view.push( _this.elements[i] );
			}
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Stuff to do on resize

	_this.on_resize = function()
	{
		// Update viewport/element data

		_this.update_viewport();
		_this.update_element_heights();

		// Update display

		_this.update_viewport_position();
		_this.update_elements_in_view();
		_this.animate();
	}

	// ----------------------------------------------------------------------------------------------------
	// Update viewport parameters

	_this.update_viewport = function()
	{
		_this.body_height = $document.height();
		_this.viewport_height = $window.height();
	}

	// ----------------------------------------------------------------------------------------------------
	// Update height of animated elements

	_this.update_element_heights = function()
	{
		var elements_length = _this.elements.length;

		for( var i=0 ; i<elements_length ; i++ )
		{
			var element_height = _this.elements[i].element.outerHeight();
			var position = _this.elements[i].element.offset();

			_this.elements[i].height = element_height;
			_this.elements[i].top = position.top;
			_this.elements[i].bottom = position.top + element_height;
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Bind initialisation

	$document.on( _this.init_events.join( ' ' ) , function(){ _this.init(); } );

	// ----------------------------------------------------------------------------------------------------

	return _this;

	// ----------------------------------------------------------------------------------------------------

})( jQuery );

// ----------------------------------------------------------------------------------------------------
// ScrollMe
// A jQuery plugin for adding simple scrolling effects to web pages
// http://scrollme.nckprsn.com
// ----------------------------------------------------------------------------------------------------
var scrollme=(function(a){var d={};var c=a(document);var b=a(window);d.body_height=0;d.viewport_height=0;d.viewport_top=0;d.viewport_bottom=0;d.viewport_top_previous=-1;d.elements=[];d.elements_in_view=[];d.property_defaults={opacity:1,translatex:0,translatey:0,translatez:0,rotatex:0,rotatey:0,rotatez:0,scale:1,scalex:1,scaley:1,scalez:1};d.scrollme_selector=".scrollme";d.animateme_selector=".animateme";d.update_interval=10;d.easing_functions={linear:function(e){return e},easeout:function(e){return e*e*e},easein:function(e){e=1-e;return 1-(e*e*e)},easeinout:function(e){if(e<0.5){return(4*e*e*e)}else{e=1-e;return 1-(4*e*e*e)}}};d.init_events=["ready","page:load","page:change"];d.init_if=function(){return true};d.init=function(){if(!d.init_if()){return false}d.init_elements();d.on_resize();b.on("resize orientationchange",function(){d.on_resize()});b.load(function(){setTimeout(function(){d.on_resize()},100)});setInterval(d.update,d.update_interval);return true};d.init_elements=function(){a(d.scrollme_selector).each(function(){var e={};e.element=a(this);var f=[];a(this).find(d.animateme_selector).addBack(d.animateme_selector).each(function(){var h={};h.element=a(this);h.when=h.element.data("when");h.from=h.element.data("from");h.to=h.element.data("to");if(h.element.is("[data-crop]")){h.crop=h.element.data("crop")}else{h.crop=true}if(h.element.is("[data-easing]")){h.easing=d.easing_functions[h.element.data("easing")]}else{h.easing=d.easing_functions.easeout}var g={};if(h.element.is("[data-opacity]")){g.opacity=h.element.data("opacity")}if(h.element.is("[data-translatex]")){g.translatex=h.element.data("translatex")}if(h.element.is("[data-translatey]")){g.translatey=h.element.data("translatey")}if(h.element.is("[data-translatez]")){g.translatez=h.element.data("translatez")}if(h.element.is("[data-rotatex]")){g.rotatex=h.element.data("rotatex")}if(h.element.is("[data-rotatey]")){g.rotatey=h.element.data("rotatey")}if(h.element.is("[data-rotatez]")){g.rotatez=h.element.data("rotatez")}if(h.element.is("[data-scale]")){g.scale=h.element.data("scale")}if(h.element.is("[data-scalex]")){g.scalex=h.element.data("scalex")}if(h.element.is("[data-scaley]")){g.scaley=h.element.data("scaley")}if(h.element.is("[data-scalez]")){g.scalez=h.element.data("scalez")}h.properties=g;f.push(h)});e.effects=f;d.elements.push(e)})};d.update=function(){window.requestAnimationFrame(function(){d.update_viewport_position();if(d.viewport_top_previous!=d.viewport_top){d.update_elements_in_view();d.animate()}d.viewport_top_previous=d.viewport_top})};d.animate=function(){var C=d.elements_in_view.length;for(var A=0;A<C;A++){var h=d.elements_in_view[A];var f=h.effects.length;for(var D=0;D<f;D++){var w=h.effects[D];switch(w.when){case"view":case"span":var r=h.top-d.viewport_height;var n=h.bottom;break;case"exit":var r=h.bottom-d.viewport_height;var n=h.bottom;break;default:var r=h.top-d.viewport_height;var n=h.top;break}if(w.crop){if(r<0){r=0}if(n>(d.body_height-d.viewport_height)){n=d.body_height-d.viewport_height}}var g=(d.viewport_top-r)/(n-r);var x=w.from;var j=w.to;var o=j-x;var k=(g-x)/o;var v=w.easing(k);var l=d.animate_value(g,v,x,j,w,"opacity");var t=d.animate_value(g,v,x,j,w,"translatey");var u=d.animate_value(g,v,x,j,w,"translatex");var s=d.animate_value(g,v,x,j,w,"translatez");var B=d.animate_value(g,v,x,j,w,"rotatex");var z=d.animate_value(g,v,x,j,w,"rotatey");var y=d.animate_value(g,v,x,j,w,"rotatez");var E=d.animate_value(g,v,x,j,w,"scale");var q=d.animate_value(g,v,x,j,w,"scalex");var p=d.animate_value(g,v,x,j,w,"scaley");var m=d.animate_value(g,v,x,j,w,"scalez");if("scale" in w.properties){q=E;p=E;m=E}w.element.css({opacity:l,transform:"translate3d( "+u+"px , "+t+"px , "+s+"px ) rotateX( "+B+"deg ) rotateY( "+z+"deg ) rotateZ( "+y+"deg ) scale3d( "+q+" , "+p+" , "+m+" )"})}}};d.animate_value=function(i,h,j,k,n,m){var g=d.property_defaults[m];if(!(m in n.properties)){return g}var e=n.properties[m];var f=(k>j)?true:false;if(i<j&&f){return g}if(i>k&&f){return e}if(i>j&&!f){return g}if(i<k&&!f){return e}var l=g+(h*(e-g));switch(m){case"opacity":l=l.toFixed(2);break;case"translatex":l=l.toFixed(0);break;case"translatey":l=l.toFixed(0);break;case"translatez":l=l.toFixed(0);break;case"rotatex":l=l.toFixed(1);break;case"rotatey":l=l.toFixed(1);break;case"rotatez":l=l.toFixed(1);break;case"scale":l=l.toFixed(3);break;default:break}return l};d.update_viewport_position=function(){d.viewport_top=b.scrollTop();d.viewport_bottom=d.viewport_top+d.viewport_height};d.update_elements_in_view=function(){d.elements_in_view=[];var f=d.elements.length;for(var e=0;e<f;e++){if((d.elements[e].top<d.viewport_bottom)&&(d.elements[e].bottom>d.viewport_top)){d.elements_in_view.push(d.elements[e])}}};d.on_resize=function(){d.update_viewport();d.update_element_heights();d.update_viewport_position();d.update_elements_in_view();d.animate()};d.update_viewport=function(){d.body_height=c.height();d.viewport_height=b.height()};d.update_element_heights=function(){var g=d.elements.length;for(var f=0;f<g;f++){var h=d.elements[f].element.outerHeight();var e=d.elements[f].element.offset();d.elements[f].height=h;d.elements[f].top=e.top;d.elements[f].bottom=e.top+h}};c.on(d.init_events.join(" "),function(){d.init()});return d})(jQuery);

/**
 * Zazar Presentation Framework
 *
 * Library: jquery.zazar.js
 * 
 * Version: 2.0.0
 * (C) 2011-2012 Zazar Ltd
 * 
 * Description: Framework function and effect library
 * 
 * History:
 * 2.0.0 - First commercial release
 *
 **/


(function($){

	$.zazar = {
		all: function() {

			// Initialise all functions with default values
			$.zazar.accordion();
			$.zazar.bookmark();
			$.zazar.dialog();
			$.zazar.navigation();
			$.zazar.random();
			$.zazar.reveal();
			$.zazar.rotate();
			$.zazar.scrollto();
			$.zazar.slider();
			$.zazar.tabs();
			$.zazar.ticker();
			$.zazar.tooltip();
			$.zazar.tree();
		},
		accordion: function(options) {

			// Set defaults
			var defaults = {
				selector: '.accordion',
				titletag: 'h4',
				contenttag: 'p',
				oneclick: true,
				speed: 400
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {
				var obj = $(this);
				if (!$(obj).hasClass('accordion')) $(obj).addClass('accordion');

				// Get each child item
				$(this).children().each(function() {

					// Get content element
					var content = $(options.contenttag,this);

					// Hide content
					$(content).hide();

					// Style title with link pointer
					$(options.titletag,this).css({
						cursor: 'pointer'
					}).click(function() {

						// If oneclick option then hide any visible content
						if (options.oneclick) {
							$(options.contenttag,obj).slideUp();
						}

						// Show or hide content
						if (!$(content).is(':visible')) {
							$(content).slideDown(options.speed);
						} else {
							$(content).slideUp(options.speed);
						}
					});
				});
			});
		},
		bookmark: function(options) {

			// Set defaults
			var defaults = {
				selector: 'a.bookmark'
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {

				// Attach click event to anchor
				$(this).bind('click',function() {

					var url = window.location;
					var title = document.title;									

					// Add bookmark on supported browsers
					if (window.sidebar) {
						window.sidebar.addPanel(title, url,"");
					} else if( window.external || document.all) {
						window.external.AddFavorite( url, title);
					} else {
						alert('Your browser does not support this bookmark action');
					}

					// Override default anchor handling
					return false;
				});
			});
		},
		dialog: function(options) {

			// Set defaults
			var defaults = {
				selector: '.dialog',
				id: 'dialog',
				modal: true,
				opacity: 0.8,
				fade: 'fast',
				width: 800,
				height: 500,
				errormsg: 'The content could not be loaded'
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function(i,e) {
				var obj = $(this);

				// Set up variables
				var cX, cY, cI, cJ;
				cX = cY = cI = cJ = 0;
				var dlg, dlgm, dlgt, dlgc;
				var el;
				var id = '';

				// Function to show dialog
				var dialogOpen = function() {

					// Get window width and full height
					var x = $(window).width();
					var y = $(document).height();

					// Calculate center
					cX = $(window).width() / 2;
					cY = $(window).height() / 2;

					// Show background mask for modal option
					if (options.modal) {

						dlgm = $('<div class="dialogMask"></div>').appendTo('body').css({
							display: 'none',
							position: 'absolute',
							width: x,
							height: y,
							top: '0',
							left: '0',
							zIndex: '10000',
							opacity: options.opacity
						}).fadeIn(options.fade).click(function() {
							dialogClose();
						});
		                        }

					// Create dialog window
					dlg = $('<div id="'+ options.id +'" class="dialogBox loader"></div>').appendTo('body');

					x = cX - $(dlg).width() / 2;
					y = cY - $(dlg).height() / 2;

					$(dlg).css({
						display: 'none',
						position: 'fixed',
						left: x,
						top: y,
						zIndex: '10001'
					});

					// Support for IE6
					if ($.browser.msie  && parseInt($.browser.version) <= 7) {

						cI = $(window).scrollTop(); 
						$(dlg).css({
							position: 'absolute',
							top: (y + cI) + 'px',
							paddingTop: '2em'
						});
						$('select, object, embed').css({
							visibility: 'hidden'
						});
					}

					$(dlg).fadeIn(options.fade);

					// Create title & close button
					dlgt = $('<span class="dialogTitle"></span>').appendTo($(dlg));
					$('<a href="#" class="dialogClose"></a>').appendTo($(dlg)).click(function(e) {
						e.preventDefault();
						dialogClose();
					});
					$('.dialogTitle, .dialogClose').css({
						display: 'none',
						position: 'absolute'
					});

					cJ = $('.dialogClose').width();

					// Create content container
					dlgc = $('<div class="dialogContent"></div>').appendTo($(dlg)).css({
						display: 'none'
					});
					
					// Load content from anchor
					dialogContent(obj);
				};

				// Function to close dialog
				var dialogClose = function() {

					// Reapply id for elements
					if (id) $(el).attr('id',id);

					// Remove dialog
					$('.dlgContent img').remove();
					$(dlg).remove();

					// Remove background mask
					if (options.modal) {

						$(dlgm).fadeOut(options.fade,function() {

							if ($.browser.msie  && parseInt($.browser.version) <= 7) {
								$('select, object, embed').css({
									visibility: 'visible'
								});
							}

							$(this).remove();
						});
					}
				};

				// Function to change content
				var dialogContent = function(obj) {

					var x = 0, y = 0;
					var err = false;

					// Remove any existing content
					$('.dialogTitle, .dialogClose, .dialogContent').fadeOut(options.fade);
					$(dlgc).html('');
					
					// Show loader
					$(dlg).addClass('loader');					

					// Set new title
					$(dlgt).html($(obj).attr('title'));

					// Get content link and type
					var href = $(obj).attr('href');
					var type = href.substr(href.lastIndexOf('.')).toLowerCase();

					if (type == '.gif' || type == '.jpg' || type == '.jpeg' || type == '.png' || type == '.bmp') {
					
						// Display image
						var img = new Image();

						$(img).load(function() {

							$(dlgc).css({textAlign: 'center'}).append(img);

							dialogAnimate(img.width, img.height);
						}).error(function() {
							dialogError();
						}).attr('src', href + '?' + (new Date()).getTime());
					} else if (href.charAt(0) == '#') {

						// Get element and ID
						el = $(href).get(0);

						if (el) {

							id = $(el).attr('id');

							// Create clone and clear original ID
							var el2 = $(el).clone();
							$(el).attr('id','');

							// Append to content
							$(dlgc).html($(el2).html());

							x = $(dlgc).width();
							y = $(dlgc).height();

							dialogAnimate(x,y);
						} else {
							dialogError();
						}
					} else {

						if (type == '.swf' || $(obj).hasClass('flash')) {

							// Display flash
							var html = '<object width="100%" height="100%" style="visibility: visible;">' +
								   '<param name="allowscriptaccess" value="always" />' +
								   '<param name="allowfullscreen" value="true" />' +
								   '<param name="movie" value="'+ href +'" />' +
								   '<embed src="'+ href +'" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="100%" height="100%" style="visibility: visible;"></embed>' +
								   '</object>';

							// Get flash size or set default
							x = 560;
							y = 315;
						} else {

							// Display in iFrame with default size
							var html = '<iframe frameborder="0" src="'+ href +'" scrolling="auto" style="width: 100%; height: 100%" />';
						}

						// Set content and style
						$(dlgc).css({width: '100%', height: '100%'}).html(html);

						dialogAnimate(x,y);
					}
				};

				// Function to animate to the new size of content
				var dialogAnimate = function(x,y) {

					// Set default size if zero
					if (x == 0) x = options.width;
					if (y == 0) y = options.height;

					// Set dialog width to title width
					if (($(dlgt).width() + cJ) > x) x = $(dlgt).width() + cJ;

					var offX = cX - (x / 2);
					var offY = cY - (y / 2) + cI;

					$(dlg).animate({width: x, height: y, left: offX, top: offY}, 200, function() {

						$('.dialogTitle, .dialogClose, .dialogContent').fadeIn(options.fade);
						$(dlg).removeClass('loader');
					});
				}

				// Function to show default error message
				var dialogError = function() {

					$(dlgc).html(options.errormsg).css({whiteSpace: 'nowrap'});
					$(dlgt).html('');

					var x = $(dlgc).width();
					var y = $(dlgc).height();

					dialogAnimate(x,y);
				}

				// Main actions
				$(this).bind('click', function(e) {
					e.preventDefault();

					if ($('#'+ options.id).length == 0) {
						dialogOpen();
					} else {
						dlg = $('#'+ options.id);
						dlgm = $('.dialogMask');

						dialogClose();
					}	
				});
			});
		},
		navigation: function(options) {

			// Set defaults
			var defaults = {
				selector: '.navigation',
				fade: 200,
				arrows: true,
				vertical: false
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {

				var obj = $(this);					// Current element
				var dir = options.vertical ? 'vertical' : 'horizontal';	// Orientation stylesheet class name

				// Add effect classes if required
				if (!$(obj).hasClass('navigation')) $(obj).addClass('navigation');
				if (!$(obj).hasClass(dir)) $(obj).addClass(dir);

				// Fix z-index IE bug
				if ($.browser.msie  && parseInt($.browser.version) <= 7) {

					$('.navigation ul').parents().each(function() {
						var pos = $(this).css('position');
 
						if (pos == 'relative' || pos == 'absolute' || pos == 'fixed') {
							$(this).hover(function() {
								$(this).css('zIndex', 1000); 
							}, function() {
								$(this).css('zIndex', 0);
							});
						}
					});
				}

				// Add submenu indicators
				if (options.arrows) {

					// Add arrow indicators
					$('li', this).has('ul').each(function() {
						$('a:first',this).append('<span>+</span>');
					});
				}

				// Action for each list item
				$('li', this).each(function() {					

					// Show and hide menu levels
					$(this).hover(function() {
						$('ul:first', this).fadeIn(options.fadein);
					}, function() {
						$('ul', this).hide();
					});
				});
			});
		},
		random: function(options) {

			// Set defaults
			var defaults = {
				selector: '.random'
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {
				var obj = $(this);
				if (!$(obj).hasClass('random')) $(obj).addClass('random');

				var item = Math.floor(Math.random() * $(obj).children().length) + 1;

				// Hide all children
				$(obj).children().hide();

				// Show random child item
				$(obj).children(':nth-child('+ item +')').show();
			});
		},
		reveal: function(options) {

			// Set defaults
			var defaults = {
				selector: '.reveal',
				speed: 400
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {
				var obj;

				// Show pointer for non anchors and remove focus outline
				$(this).css({cursor: 'pointer', outline: 0});

				// Reveal previous element
				if ($(this).hasClass('prev')) {
					obj = $(this).prev().hide();
				} else {

					// Reveal element by ID
					if ($(this).hasClass('id')) {
						obj = $(this).attr('href');
						obj = $(obj).hide();
					} else {

						// Default reveal next element
						obj = $(this).next().hide();
					}
				}

				// Perform reveal
				$(this).toggle(function() {
					obj.slideDown(options.speed);
				}, function () {
					obj.slideUp(options.speed);					
				});
			});
		},
		rotate: function(options) {

			// Set defaults
			var defaults = {
				selector: '.rotate',
				items: 3,
				pause: 3000,
				speed: 800,
				direction: 'up',
				hoverpause: true,
				rowheight: 0
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {
				var obj = $(this);
				if (!$(obj).hasClass('rotate')) $(obj).addClass('rotate');

				var rowHeight = options.rowheight;

				// Create frame and item containers
				obj.wrap('<div class="rotateFrame" />');
				obj.children('li').wrapInner('<div class="rotateItem" />');

				// Hide list and style
				obj.parent().css({overflow: 'hidden', position: 'relative'});

				if (rowHeight == 0) {

					// Calculate largest item height
					obj.children('li').each(function() {

						if ($(this).height() > rowHeight) {
							rowHeight = $(this).height();
						}
					});
				}
				
				// Set height of list items
				obj.children('li').each(function() {
					$(this).height(rowHeight);
				});

				// Set container frame height
				obj.parent().height(rowHeight * options.items);

				// Function to handle item rotation
				function rotateMove() {

					// If item paused exit
					if (obj.hasClass('pause')) return;
		
					// Scroll in chosen direction
					if (options.direction == 'down') {

						// Get last list item and copy	
						var item = obj.children('li:last').clone(true);

						// Scroll item
						obj.css('top', '-'+ rowHeight +'px').prepend(item);
						obj.animate({top: 0}, options.speed, function() {
				        		$(this).children('li:last').remove();
		        			});
					} else {

						// Get first list item and copy
						var item = obj.children('li:first').clone(true);

						// Scroll item
						obj.animate({top: '-=' + rowHeight + 'px'}, options.speed, function() {
				        		$(this).children('li:first').remove();
	        					$(this).css('top', '0');
		        			});

						// Append copied item to end of list
					    	item.appendTo(obj);
					}
				};

				// Set timer interval for scrolling		
    				var interval = setInterval(function(){ rotateMove(); }, options.pause);
		
				// Enable pausing on mouse hover		
				if (options.hoverpause) {
					obj.bind("mouseenter",function() {
						obj.addClass('pause');
					}).bind("mouseleave",function() {
						obj.removeClass('pause');
					});
				}
			});
		},
		scrollto: function(options) {

			// Set defaults
			var defaults = {
				selector: 'a.scrollto',
				speed: 1000
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {

				// Attach click event to anchor
				$(this).bind('click',function() {
									
					// Scroll to given element
					$('html,body').animate({
						scrollTop: $($(this).attr('href')).offset().top
					}, options.speed);

					// Override default anchor handling
					return false;
				});
			});
		},
		slider: function(options) {
	  
			// Set defaults
			var defaults = {
				selector: '.slider',
				pause: 3000,
				speed: 800,
				direction: 'right',
				hoverpause: true,
				auto: true,
				continuous: true,
				pagination: '',
				controls: ''
			}; 
			var options = $.extend(defaults, options);
				
			return $(options.selector).each(function() {

				var obj = $(this);				// Current element
				var timeout;					// Timer for auto scrolling
				var listTotal = $(obj).children().length;	// Total number of list items
				var listMax = listTotal - 1;			// Zero indexed list total
				var slideX = 0;					// Slider width
				var slideY = 0;					// Slider height
				var itemIndex = 0;				// Current item index
				var nOffset = 0;				// Continous scroll offset
				var auto = false;				// State of auto scroll
				var pause = options.pause;			// Delay in slide animation
				var ready = true;				// Indicates if animation is in progress

				// Add framework class
				if (!$(obj).hasClass('slider')) $(obj).addClass('slider');

				// Get height set by styles
				slideX = $(obj).width();
				slideY = $(obj).height();
	
				// Create frame and item containers
				obj.wrap('<div class="sliderFrame" />');
				obj.children('li').wrapInner('<div class="sliderItem" />');

				// Set frame to current object & style
				obj = obj.parent();
				obj.width(slideX);
				obj.height(slideY);
				obj.css('overflow','hidden');

				// Style list
				$('ul',obj).css('width', slideX * listTotal);
				$('ul',obj).children('li').css({width: slideX+'px', height: slideY+'px'});

				// Clone list for continuous playing
				if (options.continuous) {
					$('ul', obj).prepend($('ul li:last-child', obj).clone());
					$('ul', obj).append($('ul li:nth-child(2)', obj).clone());
					$('ul', obj).css('width',(listTotal + 2) * slideX ).css('margin-left','-'+ slideX +'px');
					nOffset = 1;
					itemIndex = 1;
				};

				// Add pagination if required
				if (options.pagination) {

					// Get user element
					var pag = $(options.pagination);

					// Create pagination list
					var html = '<ul class="pagination">';
					for (var i=0; i < listTotal; i++) {
						html += '<li><a href="#" rel="'+ (i+1) +'">'+ (i+1) +'</a></li>';
					}
					html += '</ul>';

					// Add and set the first element as current
					$(pag).append(html);
					$('li:first', pag).addClass('current');

					// Add click handler
					$('li a', pag).click(function() {

						slideMove($(this).attr('rel'),true);
						return false;
					});
				}

				// Add controls if required
				if (options.controls) {

					// Get user element
					var con = $(options.controls);

					// Add previous and next handlers
					$('.sliderPrevious',con).click(function() {
						slideMove('left',true);
						return false;
					});

					$('.sliderNext',con).click(function() {
						slideMove('right',true);
						return false;
					});

					$('.sliderAuto',con).click(function() {
						slideAuto(!auto);
						return false;
					});
				}

				// Function to handle slide rotation
				function slideMove(inc,manual) {

					// Check for hover pause
					var pause = (!manual) ? $('ul.slider',obj).hasClass('pause') : false;

					// If ready then allow change
					if (ready && !pause) {

						// Change ready state and save current index
						ready = false;
						var oldIndex = itemIndex;

						// If controls clicked stop auto scrolling
						if (manual && options.auto) slideAuto(false);

						switch (inc) {
							case 'left':
								itemIndex = (oldIndex <= 0) ? (options.continuous ? itemIndex - 1 : nOffset) : itemIndex - 1;
								break; 
							case 'right':
								itemIndex = (oldIndex >= listMax) ? (options.continuous ? itemIndex + 1 : listMax) : itemIndex + 1;						
								break; 
							case 'random':
								itemIndex = Math.floor(Math.random() * listTotal);
								break; 
							default:
								itemIndex = inc - 1 + nOffset;
								break; 
						};

						// calculate position and speed
						var speed = (Math.abs(oldIndex - itemIndex)) * options.speed;
						var pos = (itemIndex * slideX * -1);
						pause = speed + options.pause;

						// Change pagination current highlight if enabled
						if (options.pagination) {
							var cPos = (itemIndex > listMax + nOffset) ? cPos = nOffset : (itemIndex < nOffset ? cPos = listMax + nOffset : cPos = itemIndex);
							$('li:nth-child('+ (oldIndex + 1 - nOffset) +')', pag).removeClass('current');
							$('li:nth-child('+ (cPos + 1 - nOffset) +')', pag).addClass('current');
						}
						
						// Perform slide
						$('ul.slider',obj).animate(
							{ marginLeft: pos }, 
							{ queue: false,
							  duration: speed,
							  complete: slideComplete }
						);				
					}

					// Re-start timer if auto mode
					if (options.auto) slideAuto(true);
				};

				// Check for slide looping and set position
				function slideComplete() {

					// Check for index wrap
					if (itemIndex > listMax + nOffset) itemIndex = nOffset;		
					if (itemIndex < nOffset) itemIndex = listMax + nOffset;	

					// Position new slide
					$('ul.slider',obj).css('margin-left',(itemIndex * slideX * -1));

					// Re-enable user controls
					ready = true;
				};

				// Start and stop auto scrolling
				function slideAuto(state) {

					clearTimeout(timeout);

					if (state) {
						timeout = setTimeout(function() { slideMove(options.direction,false); },pause);
						options.auto = true;
					} else {
						options.auto = false;
					}
				};

				// Check for auto start
				if (options.auto) slideAuto(true);

				// Enable pausing on mouse hover		
				if (options.hoverpause) {
					obj.bind('mouseenter',function() {
						$('ul.slider',obj).addClass('pause');
					}).bind('mouseleave',function() {
						$('ul.slider',obj).removeClass('pause');
					});
				}
			});						
		},
		tabs: function(options) {

			// Set defaults
			var defaults = {
				selector: '.tabs',
				content: '.tab'
			};
			var options = $.extend(defaults, options);

			// Hide all tab elements on page
			$(options.content).hide();

			return $(options.selector).each(function() {
				var obj = $(this);
				if (!$(obj).hasClass('tabs')) $(obj).addClass('tabs');

				// Check if any tab is current
				var tab = $('li.current',obj);

				if (tab.length > 0) {

					// Select current tab
					$('a',tab).show();
					tabChange(tab);
				} else {

					// Default to first tab
					var tab = $('li:first',this);

					if (tab.length > 0) {
						tab.addClass('current').find('a').show();
						tabChange(tab);
					}
				}

				// Add click handler
				$('li',this).click(function() {

					// Check the tab is not already chosen
					if (!$(this).hasClass('current')) {
						tabChange(this);
					}

					// Override default anchor handling
					return false;
				});

				function tabChange(obj2) {

					// Get current tab from class
					tab = $('li.current',obj).find('a').attr('href');
					$(tab).hide();

					// Remove class from tab list and add to current item
					$('li',obj).removeClass('current');
					$(obj2).addClass('current');

					// Get tab element
					tab = $(obj2).find('a').attr('href');

					// Show chosen tab
					$(tab).show();
				};
			});
		},
		ticker: function(options) {

			// Set defaults
			var defaults = {
				selector: '.ticker',
				pause: 3000,
				speed: 28,
				fade: 500,
				direction: 'next',
				hoverpause: true,
				auto: true,
				height: 0,
				pagination: '',
				controls: ''
			};
			var options = $.extend(defaults, options);
	
			return $(options.selector).each(function() {

				var obj = $(this);				// Current element
				var interval;					// Timer for auto scrolling
				var timeout;					// Timer for ticker animation
				var rowY = options.height;			// Height of ticker
				var listTotal = $(obj).children().length;	// Total number of list items
				var itemIndex = 1;				// Current item index
				var itemTitle = '';				// Current item title
				var charLen = 0;				// Ticker character progress
				var charSkip = false;				// Ticker skipping characters mode
				var ready = true;				// Indicates if animation is in progress

				// Add framework class
				if (!$(obj).hasClass('ticker')) $(obj).addClass('ticker');

				// Hide all list items
				$(obj).children().hide();

				// If height not set calculate
				if (rowY == 0) {

					// Calculate largest item height
					obj.children('li').each(function() {

						if ($(this).height() > rowY) {
							rowY = $(this).height();
						}
					});
				}

				// Set height of list items and show first
				$('li',obj).height(rowY);
				$('li:nth-child('+ itemIndex +')',obj).show();

				// Add pagination if required
				if (options.pagination) {

					// Get user element
					var pag = $(options.pagination);

					// Create pagination list
					var html = '<ul class="pagination">';
					for (var i=0; i < listTotal; i++) {
						html += '<li><a href="#" rel="'+ (i+1) +'">'+ (i+1) +'</a></li>';
					}
					html += '</ul>';

					// Add and set the first element as current
					$(pag).append(html);
					$('li:first', pag).addClass('current');

					// Add click handler
					$('li a', pag).click(function() {

						// Only change if ready
						tickerRotate($(this).attr('rel'),true);
						return false;
					});
				}

				// Add controls if required
				if (options.controls) {

					// Get user element
					var con = $(options.controls);
					
					// Add previous and next handlers
					$('.tickerPrevious',con).click(function() {
						tickerRotate('previous',true);
						return false;
					});

					$('.tickerNext',con).click(function() {
						tickerRotate('next',true);
						return false;
					});
				}

				// Function to handle item rotation
				function tickerRotate(inc,manual) {

					// Check for hover pause
					var pause = (!manual) ? obj.hasClass('pause') : false;

					// If ready then allow change
					if (ready && !pause) {

						// Clear any ticker animation in progress
						if (charLen > 0) {
							clearTimeout(timeout);
							$('li:nth-child('+ itemIndex +')',obj).html(itemTitle);
							charLen = 0;
						}

						// Change ready state and clear existing timer	
						ready = false;
						clearInterval(interval);

						// If controls clicked stop auto scrolling
						if (manual) options.auto = false;

						switch (inc) {

							case 'next':
								var newIndex = itemIndex + 1;
								if (newIndex > listTotal) newIndex = 1;
								break;

							case 'previous':
								var newIndex = itemIndex - 1;
								if (newIndex < 1) newIndex = listTotal;
								break;

							default:
								var newIndex = inc;
								break; 
						};

						// Change pagination current highlight if enabled
						if (options.pagination) {
							$('li:nth-child('+ itemIndex +')',pag).removeClass('current');
							$('li:nth-child('+ newIndex +')',pag).addClass('current');
						}

						// Fade out current item
						$('li:nth-child('+ itemIndex +')',obj).fadeOut(options.fade, function() {

							// Set new row item
							itemIndex = newIndex;
							var item = $('li:nth-child('+ newIndex +')',obj);
							itemTitle = $(item).html();

							// Animate new item
							tickerType(item);

							// Re-enable user controls
							ready = true;							
						});
					}
				};

				// Function for typing effect
				function tickerType(item) {

					// Check if character is within a tag
					var c = itemTitle.substr(charLen, 1);
					if (c == '<'){ charSkip = true; }
					if (c == '>'){ charSkip = false; }

					// If no speed fade in
					if (options.speed == 0) {
						charLen = itemTitle.length + 1;
						$(item).html(itemTitle.substr(0, charLen++)).fadeIn(options.fade);
					} else {
						$(item).html(itemTitle.substr(0, charLen++)).show();
					}
			
					// Check if another character is available
					if (charLen < itemTitle.length + 1) {

						// If character is a tag or pause show without delay
						if (charSkip || $(item).parent().hasClass('pause')) {
							tickerType(item);
						} else {
							timeout = setTimeout(function() { tickerType(item); }, options.speed);
						}
					} else {

						// Reset animation and timer	
						charLen = 0;
						charSkip = false;
			
						if (options.auto) {
							interval = setInterval(function() { tickerRotate(options.direction,false); }, options.pause);
						}
					}
				};

				// Check for auto start
				if (options.auto) {
					interval = setInterval(function() { tickerRotate(options.direction,false); }, options.pause);
				}

				// Enable pausing on mouse hover		
				if (options.hoverpause) {
					obj.bind('mouseenter',function() {
						obj.addClass('pause');
					}).bind('mouseleave',function() {
						obj.removeClass('pause');
					});
				}
			});
		},
		tooltip: function(options) {

			// Set defaults
			var defaults = {
				selector: '.tooltip',
				id: 'tooltip',
				offsetx: 16,
				offsety: 16,
				tipbyid: true,
				cursor: '',
				defaulttip: ''
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {

				var itemTitle = $(this).attr('title');
				var tipText = itemTitle;

				$(this).hover(function(e) {

					// If content ID's allowed check for element
					if (options.tipbyid) {
						tipText = (tipText.substring(0,1) == '#') ? $(tipText).html() : tipText;
					}

					// If no text then use default
					tipText = (tipText != '') ? tipText : options.defaulttip;

					// Show custom cursor
					if (options.cursor) $(this).css('cursor', options.cursor);

					// Remove title from item
					$(this).attr('title', '');

					if (tipText != "" && tipText != undefined) {

						$('body').append('<div id="' + options.id + '" class="tooltipPopup">' + tipText + '</div>');
						$('#' + options.id).css({
							'position': 'absolute',
							'display': 'none',
							'zIndex': 1000
						}).css('top', (e.pageY - options.offsety) + 'px').css('left', (e.pageX + options.offsetx) + 'px');

						// Prevent layout jumping in early IE
						if ($.browser.msie  && parseInt($.browser.version) <= 7) {
							$('#' + options.id).show();
						} else {
							$('#' + options.id).fadeIn('fast');
						}
					}
				}, function() {

					// Remove tip from dom and re-add title
					$('#' + options.id).remove();
					$(this).attr('title', itemTitle);
				});

				// Track mouse movement
				$(this).mousemove(function(e) {

					var x = ((e.pageX + options.offsetx + $(this).width()) < $(window).width()) ? (e.pageX + options.offsetx) : (e.pageX - options.offsetX - $(this).width() - 16);
					$('#' + options.id).css('top', (e.pageY - options.offsety) + 'px').css('left', (x + 'px'));
				});
			});
		},
		tree: function(options) {

			// Set defaults
			var defaults = {
				selector: '.tree',
				speed: 400,
				showlines: true,
				expandroot: true
			};
			var options = $.extend(defaults, options);

			return $(options.selector).each(function() {

				var obj = $(this);
				var root = $(this).find('li');
				var state = '';

				if (!$(obj).hasClass('tree')) $(obj).addClass('tree');

				// Collapse outline
				$(obj).find('ul').hide();

				// Support for IE6
				if ($.browser.msie  && parseInt($.browser.version) <= 7) $('li',obj).css('height','1px');

				// Display guidelines if required
				if (options.showlines) $(obj).addClass('lines');

				// Ensure the last item has the 'last' class
				$('li:last-child',obj).addClass('last');

				// Add button to any item with sub-items
				$(root).each(function() {

					// Has the item sub-items
					if ($(this).children('ul').length > 0) {

						// Set default state and option to expamd root
						state = 'treePlus';
						if (options.expandroot && $(this).parent().hasClass('tree')) state += ' treeMinus';

						$(this).addClass('root').prepend('<span class="'+ state +'" />');
					}
				});

				// Perform default expands
				$('span.treeMinus',obj).nextAll('ul').show();

				// Add click event to toggle levels
				$('span.treePlus',obj).click(function() {

					if ($(this).hasClass('treeMinus')) {
						$(this).toggleClass('treeMinus').nextAll('ul').slideUp(options.speed);
					} else {
						$(this).toggleClass('treeMinus').nextAll('ul').slideDown(options.speed);
					}
				});
			});
		}
	};
})(jQuery);
(function(l){l.fn.rssfeed=function(b,h,w){h=l.extend({limit:10,offset:1,header:!0,titletag:"h4",date:!0,dateformat:"datetime",content:!0,snippet:!0,media:!0,showerror:!0,errormsg:"",key:null,ssl:!1,linktarget:"_self",linkredirect:"",linkcontent:!1,sort:"",sortasc:!0,historical:!1},h);return this.each(function(z,q){var u=l(q),f="";h.ssl&&(f="s");u.hasClass("rssFeed")||u.addClass("rssFeed");if(null==b)return!1;0<h.offset&&(h.offset-=1);h.limit+=h.offset;f="http"+f+"://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+
encodeURIComponent(b);f+="&num="+h.limit;h.historical&&(f+="&scoring=h");null!=h.key&&(f+="&key="+h.key);l.getJSON(f+"&output=json_xml",function(b){if(200==b.responseStatus){var f=b.responseData,e=h;if(b=f.feed){var j=[],d=0,m="",v="odd";if(e.media){var n=f.xmlString;"Microsoft Internet Explorer"==navigator.appName?(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(n)):d=(new DOMParser).parseFromString(n,"text/xml");n=d.getElementsByTagName("item")}e.header&&(m+='<div class="rssHeader"><a href="'+
b.link+'" title="'+b.description+'">'+b.title+"</a></div>");m+='<div class="rssBody"><ul>';for(f=e.offset;f<b.entries.length;f++){d=f-e.offset;j[d]=[];var g=b.entries[f],a,c="",k=g.link;switch(e.sort){case "title":c=g.title;break;case "date":c=g.publishedDate}j[d].sort=c;if(g.publishedDate)switch(c=new Date(g.publishedDate),a=c.toLocaleDateString()+" "+c.toLocaleTimeString(),e.dateformat){case "datetime":break;case "date":a=c.toLocaleDateString();break;case "time":a=c.toLocaleTimeString();break;case "timeline":a=
new Date(c);a=Math.round(((new Date).getTime()-a.getTime())/1E3);60>a?a="< 1 min":(3600>a?(a=Math.round(a/60)-1,c="min"):86400>a?(a=Math.round(a/3600)-1,c="hour"):604800>a?(a=Math.round(a/86400)-1,c="day"):(a=Math.round(a/604800)-1,c="week"),1<a&&(c+="s"),a=a+" "+c);break;default:a=c,c=new Date(a),a=e.dateformat,a=a.replace("dd",p(c.getDate())),a=a.replace("MMMM",x(c.getMonth())),a=a.replace("MM",p(c.getMonth()+1)),a=a.replace("yyyy",c.getFullYear()),a=a.replace("hh",p(c.getHours())),a=a.replace("mm",
p(c.getMinutes())),a=a.replace("ss",p(c.getSeconds()))}e.linkredirect&&(k=encodeURIComponent(k));j[d].html="<"+e.titletag+'><a href="'+e.linkredirect+k+'" title="View this feed at '+b.title+'">'+g.title+"</a></"+e.titletag+">";e.date&&a&&(j[d].html+="<div>"+a+"</div>");e.content&&(g=e.snippet&&""!=g.contentSnippet?g.contentSnippet:g.content,e.linkcontent&&(g='<a href="'+e.linkredirect+k+'" title="View this feed at '+b.title+'">'+g+"</a>"),j[d].html+="<p>"+g+"</p>");if(e.media&&0<n.length&&(k=n[f].getElementsByTagName("enclosure"),
0<k.length)){j[d].html+='<div class="rssMedia"><div>Media files</div><ul>';for(g=0;g<k.length;g++){var r=k[g].getAttribute("url"),s=k[g].getAttribute("type"),t=k[g].getAttribute("length"),c=j[d],y=j[d].html,r='<li><a href="'+r+'" title="Download this media">'+r.split("/").pop()+"</a> ("+s+", ",s=Math.floor(Math.log(t)/Math.log(1024)),t=(t/Math.pow(1024,Math.floor(s))).toFixed(2)+" "+"bytes kb MB GB TB PB".split(" ")[s];c.html=y+(r+t+")</li>")}j[d].html+="</ul></div>"}}e.sort&&j.sort(function(a,c){if(e.sortasc)var b=
a.sort,d=c.sort;else b=c.sort,d=a.sort;if("date"==e.sort)return new Date(b)-new Date(d);b=b.toLowerCase();d=d.toLowerCase();return b<d?-1:b>d?1:0});l.each(j,function(a){m+='<li class="rssRow '+v+'">'+j[a].html+"</li>";v="odd"==v?"even":"odd"});m+="</ul></div>";l(q).html(m);l("a",q).attr("target",e.linktarget)}l.isFunction(w)&&w.call(this,u)}else h.showerror&&(d=""!=h.errormsg?h.errormsg:b.responseDetails),l(q).html('<div class="rssError"><p>'+d+"</p></div>")})})};var p=function(b){b+="";2>b.length&&
(b="0"+b);return b},x=function(b){return"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[b]}})(jQuery);
    $(".has-mega-dropdown").hover(
            function() {
                var dropdownTarget = $(this).data("dropdown");
                $(dropdownTarget).toggleClass("is-active");
            }
            );
