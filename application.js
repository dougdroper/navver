/* globals Navigator, ScrollUp, ScrollDown, ScrollToTop, ScrollToBottom */
window.Application = class Application {
  constructor () {
    this.keysPressed = ''

    this.navigators = [
      Navigator
    ]
    this.shortcuts = [
      new ScrollUp(),
      new ScrollDown(),
      new ScrollToTop(),
      new ScrollToBottom()
    ]
  }

  handleKeyboardEvent (e) {
    if (e.ctrlKey || e.metaKey || this.insideInput(e)) {
      return
    }

    this.keysPressed += e.key

    if (this.executeNavigator() || this.executeShortcut()) {
      e.preventDefault()
      return false
    }
  }

  executeNavigator () {
    if (!this.navigator) {
      for (var i = 0; i < this.navigators.length; i++) {
        var Navigator = this.navigators[i]
        if (this.endsWith(this.keysPressed, Navigator.activationKey())) {
          this.currentNavigator = new Navigator(function () {
            this.currentNavigator = null
          }.bind(this))
          return true
        }
      }
    }
  }

  executeShortcut () {
    for (var i = 0; i < this.shortcuts.length; i++) {
      var shortcut = this.shortcuts[i]
      if (this.endsWith(this.keysPressed, shortcut.key())) {
        this.keysPressed = ''
        shortcut.action()
        return true
      }
    }
    return false
  }

  insideInput (e) {
    return e.srcElement.tagName === 'INPUT' ||
      e.srcElement.tagName === 'TEXTAREA'
  }

  endsWith (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1
  }
}

var application = new window.Application()
window.addEventListener('keydown', application.handleKeyboardEvent.bind(application))
