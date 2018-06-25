import { OfferTransWWWPage } from './app.po';

describe('offer-trans-www App', () => {
  let page: OfferTransWWWPage;

  beforeEach(() => {
    page = new OfferTransWWWPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
