/*
 * Shell style manifest.  Each import is a separate webpack module, which
 * keeps Paragon's CSS and the shell's own SCSS as independent compilation
 * units: the build pipeline wraps each in the `shell` cascade layer by
 * resource path.  See ADR 0008.
 */
import '@openedx/paragon/dist/core.min.css';
import '@openedx/paragon/dist/light.min.css';
import './style.scss';
