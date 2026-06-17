import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.attributes = new Map();
    this.children = [];
    this.dataset = {};
    this.innerHTML = '';
    this.textContent = '';
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.children = children;
    this.innerHTML = '';
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  addEventListener() {}
}

describe('project catalog page', () => {
  it('renders project filters as DOM text, not interpolated HTML', async () => {
    const filters = new FakeElement('div');
    const list = new FakeElement('div');
    const previousDocument = globalThis.document;

    globalThis.document = {
      getElementById(id) {
        return id === 'project-filters' ? filters : list;
      },
      createElement(tagName) {
        return new FakeElement(tagName);
      },
    };

    try {
      const { renderFilters } = await import(`../assets/projects-page.js?test=${Date.now()}`);
      const category = 'Pay<&>"\'ment';

      renderFilters(filters, [category], category);

      assert.equal(filters.innerHTML, '');
      assert.equal(filters.children.length, 1);
      assert.equal(filters.children[0].textContent, category);
      assert.equal(filters.children[0].dataset.category, category);
      assert.equal(filters.children[0].getAttribute('aria-pressed'), 'true');
    } finally {
      if (previousDocument === undefined) {
        delete globalThis.document;
      } else {
        globalThis.document = previousDocument;
      }
    }
  });
});
