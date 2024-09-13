// This file exists because module federation requires our entry file to be asynchronous.  If you
// move the contents of bootstrap.tsx into this file and remove the import(), module federation
// will cease to work.
import('./bootstrap');
