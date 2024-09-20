import PropTypes from 'prop-types';
import React, { ReactNode, RefObject } from 'react';
import { CSSTransition } from 'react-transition-group';
import MenuTrigger from './MenuTrigger';

const MenuTriggerComp = <MenuTrigger><div /></MenuTrigger>;
const MenuTriggerType = MenuTriggerComp.type;

const menuPropTypes = {
  tag: PropTypes.string,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  closeOnDocumentClick: PropTypes.bool,
  respondToPointerEvents: PropTypes.bool,
  className: PropTypes.string,
  transitionTimeout: PropTypes.number,
  transitionClassName: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

interface MenuProps {
  children: ReactNode,
  className?: string,
  closeOnDocumentClick?: boolean,
  onClose?: (() => void) | null,
  onOpen?: (() => void) | null,
  respondToPointerEvents?: boolean,
  tag?: string,
  transitionClassName?: string,
  transitionTimeout?: number,
}

export default class Menu extends React.Component<MenuProps, { expanded: boolean }> {
  menu: RefObject<HTMLElement>;

  constructor({
    children,
    className,
    closeOnDocumentClick = true,
    onClose = null,
    onOpen = null,
    respondToPointerEvents = false,
    tag = 'div',
    transitionClassName = 'menu-content',
    transitionTimeout = 250,
  }) {
    super({
      children,
      className,
      closeOnDocumentClick,
      onClose,
      onOpen,
      respondToPointerEvents,
      tag,
      transitionClassName,
      transitionTimeout,
    });

    this.menu = React.createRef<HTMLElement>();
    this.state = {
      expanded: false,
    };

    this.onTriggerClick = this.onTriggerClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  // Lifecycle Events
  componentWillUnmount() {
    document.removeEventListener('touchend', this.onDocumentClick, true);
    document.removeEventListener('click', this.onDocumentClick, true);

    // Call onClose callback when unmounting and open
    if (this.state.expanded && this.props.onClose) {
      this.props.onClose();
    }
  }

  // Event handlers
  onDocumentClick(e) {
    if (!this.props.closeOnDocumentClick) {
      return;
    }

    const clickIsInMenu = this.menu.current === e.target
      || (this.menu.current !== null && this.menu.current.contains(e.target));
    if (clickIsInMenu) {
      return;
    }

    this.close();
  }

  onTriggerClick(e) {
    // Let the browser follow the link of the trigger if the menu
    // is already expanded and the trigger has an href attribute
    if (this.state.expanded && e.target.getAttribute('href')) {
      return;
    }

    e.preventDefault();
    this.toggle();
  }

  onCloseClick() {
    this.getFocusableElements()[0].focus();
    this.close();
  }

  onKeyDown(e) {
    if (!this.state.expanded) {
      return;
    }
    switch (e.key) {
      case 'Escape': {
        e.preventDefault();
        e.stopPropagation();
        this.getFocusableElements()[0].focus();
        this.close();
        break;
      }
      case 'Enter': {
        // Using focusable elements instead of a ref to the trigger
        // because Hyperlink and Button can handle refs as functional components
        if (document.activeElement === this.getFocusableElements()[0]) {
          e.preventDefault();
          this.toggle();
        }
        break;
      }
      case 'Tab': {
        e.preventDefault();
        if (e.shiftKey) {
          this.focusPrevious();
        } else {
          this.focusNext();
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.focusNext();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        this.focusPrevious();
        break;
      }
      default:
    }
  }

  onMouseEnter() {
    if (!this.props.respondToPointerEvents) {
      return;
    }
    this.open();
  }

  onMouseLeave() {
    if (!this.props.respondToPointerEvents) {
      return;
    }
    this.close();
  }

  // Internal functions

  getFocusableElements() {
    if (this.menu.current === null) {
      return [];
    }
    return this.menu.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])');
  }

  getAttributesFromProps() {
    // Any extra props are attributes for the menu
    const attributes = {};
    Object.keys(this.props)
      .filter(property => menuPropTypes[property] === undefined)
      .forEach((property) => {
        attributes[property] = this.props[property];
      });
    return attributes;
  }

  focusNext() {
    const focusableElements = Array.from(this.getFocusableElements());
    const activeIndex = document.activeElement !== null
      ? focusableElements.indexOf(document.activeElement as HTMLElement)
      : null;
    const nextIndex = ((activeIndex || 0) + 1) % focusableElements.length;
    focusableElements[nextIndex].focus();
  }

  focusPrevious() {
    const focusableElements = Array.from(this.getFocusableElements());
    const activeIndex = document.activeElement !== null
      ? focusableElements.indexOf(document.activeElement as HTMLElement)
      : null;
    const previousIndex = (activeIndex || focusableElements.length) - 1;
    focusableElements[previousIndex].focus();
  }

  open() {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
    this.setState({ expanded: true });
    // Listen to touchend and click events to ensure the menu
    // can be closed on mobile, pointer, and mixed input devices
    document.addEventListener('touchend', this.onDocumentClick, true);
    document.addEventListener('click', this.onDocumentClick, true);
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.setState({ expanded: false });
    document.removeEventListener('touchend', this.onDocumentClick, true);
    document.removeEventListener('click', this.onDocumentClick, true);
  }

  toggle() {
    if (this.state.expanded) {
      this.close();
    } else {
      this.open();
    }
  }

  renderTrigger(node) {
    return React.cloneElement(node, {
      onClick: this.onTriggerClick,
      'aria-haspopup': 'menu',
      'aria-expanded': this.state.expanded,
    });
  }

  renderMenuContent(node) {
    return (
      <CSSTransition
        in={this.state.expanded}
        timeout={this.props.transitionTimeout}
        classNames={this.props.transitionClassName}
        unmountOnExit
        addEndListener={() => {}}
      >
        {node}
      </CSSTransition>
    );
  }

  render() {
    const { className } = this.props;

    const wrappedChildren = React.Children.map(this.props.children, (child) => {
      if (child && typeof child === 'object' && 'type' in child && child.type === MenuTriggerType) {
        return this.renderTrigger(child);
      }
      return this.renderMenuContent(child);
    });

    const rootClassName = this.state.expanded ? 'menu expanded' : 'menu';

    return React.createElement(this.props.tag || 'div', {
      className: `${rootClassName} ${className}`,
      ref: this.menu,
      onKeyDown: this.onKeyDown,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      ...this.getAttributesFromProps(),
    }, wrappedChildren);
  }
}
