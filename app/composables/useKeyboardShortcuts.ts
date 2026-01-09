export interface KeyboardShortcut {
  key: string
  ctrlOrCmd: boolean
  shift?: boolean
  alt?: boolean
  description: string
  callback: () => void
}

export const useKeyboardShortcuts = () => {
  const shortcuts = ref<Map<string, KeyboardShortcut>>(new Map())
  const isEnabled = useLocalStorage('keyboard-shortcuts-enabled', true)

  /**
   * Generate unique key for shortcut
   */
  const getShortcutKey = (
    key: string,
    ctrlOrCmd: boolean,
    shift?: boolean,
    alt?: boolean
  ): string => {
    const parts = []
    if (ctrlOrCmd) parts.push('ctrl')
    if (shift) parts.push('shift')
    if (alt) parts.push('alt')
    parts.push(key.toLowerCase())
    return parts.join('+')
  }

  /**
   * Register a keyboard shortcut
   */
  const registerShortcut = (
    key: string,
    callback: () => void,
    options: {
      ctrlOrCmd?: boolean
      shift?: boolean
      alt?: boolean
      description: string
    }
  ): void => {
    const shortcutKey = getShortcutKey(
      key,
      options.ctrlOrCmd ?? false,
      options.shift,
      options.alt
    )

    shortcuts.value.set(shortcutKey, {
      key,
      ctrlOrCmd: options.ctrlOrCmd ?? false,
      shift: options.shift,
      alt: options.alt,
      description: options.description,
      callback
    })
  }

  /**
   * Unregister a keyboard shortcut
   */
  const unregisterShortcut = (key: string, ctrlOrCmd = false, shift?: boolean, alt?: boolean): void => {
    const shortcutKey = getShortcutKey(key, ctrlOrCmd, shift, alt)
    shortcuts.value.delete(shortcutKey)
  }

  /**
   * Clear all shortcuts
   */
  const clearShortcuts = (): void => {
    shortcuts.value.clear()
  }

  /**
   * Handle keydown event
   */
  const handleKeydown = (event: KeyboardEvent): void => {
    if (!isEnabled.value) return

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Escape to close/blur
      if (event.key !== 'Escape') return
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey

    const shortcutKey = getShortcutKey(
      event.key,
      ctrlOrCmd,
      event.shiftKey,
      event.altKey
    )

    const shortcut = shortcuts.value.get(shortcutKey)

    if (shortcut) {
      event.preventDefault()
      shortcut.callback()
    }
  }

  /**
   * Setup global keyboard listener
   */
  const setupGlobalListener = (): (() => void) => {
    window.addEventListener('keydown', handleKeydown)

    // Return cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }

  /**
   * Get formatted shortcut display string
   */
  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const parts = []

    if (shortcut.ctrlOrCmd) {
      parts.push(isMac ? '⌘' : 'Ctrl')
    }
    if (shortcut.shift) {
      parts.push('Shift')
    }
    if (shortcut.alt) {
      parts.push(isMac ? '⌥' : 'Alt')
    }

    // Format key
    let key = shortcut.key
    if (key === ' ') key = 'Space'
    if (key === 'Enter') key = '↵'
    if (key === 'Escape') key = 'Esc'
    if (key === 'Backspace') key = '⌫'

    parts.push(key.toUpperCase())

    return parts.join(' + ')
  }

  /**
   * Get all registered shortcuts as array
   */
  const getAllShortcuts = computed(() => {
    return Array.from(shortcuts.value.values())
  })

  return {
    isEnabled,
    shortcuts: getAllShortcuts,
    registerShortcut,
    unregisterShortcut,
    clearShortcuts,
    setupGlobalListener,
    formatShortcut
  }
}
