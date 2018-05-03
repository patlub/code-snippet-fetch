'use babel';

import { CompositeDisposable } from 'atom';
import request from 'request'
import cheerio from 'cheerio'

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'source-fetch:fetch': () => this.fetch()
    }));
  },

  deactivate() {
    this.sourceFetchView.destroy();
  },

  fetch() {
    let editor
    let self = this

    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      this.download(selection).then((html) => {
        let answer = self.scrape(html)
        if (answer === '') {
          atom.notifications.addWarning('No answer found :(')
        } else {
          editor.insertText(answer)
        }
      }).catch((error) => {
        console.log(error)
        atom.notifications.addWarning(error.reason)
      })
    }
},

  scrape(html) {
    $ = cheerio.load(html)
    return $('div.accepted-answer pre code').text()
  },

  download(url) {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else {
        reject({
          reason: 'Unable to download page'
        })
      }
    })
  }
};
