import { SimpleappPage } from './app.po';

describe('simpleapp App', () => {
  let page: SimpleappPage;

  beforeEach(() => {
    page = new SimpleappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
