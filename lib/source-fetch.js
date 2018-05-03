'use babel';

import SourceFetchView from './source-fetch-view';
import { CompositeDisposable } from 'atom';

export default {

  sourceFetchView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.sourceFetchView = new SourceFetchView(state.sourceFetchViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.sourceFetchView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'source-fetch:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.sourceFetchView.destroy();
  },

  serialize() {
    return {
      sourceFetchViewState: this.sourceFetchView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
}

  }

};
