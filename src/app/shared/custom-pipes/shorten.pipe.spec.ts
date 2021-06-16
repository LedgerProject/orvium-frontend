import { ShortenPipe } from './shorten.pipe';

describe('shorten', () => {
  const pipe = new ShortenPipe();

  it('joins with ,', () => {
    expect(pipe.transform('This is just a test you should short', 12)).toBe('This is just...');
  });

});
