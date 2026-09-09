import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`[StudyLens Backend] Server running on http://0.0.0.0:${config.PORT}`);
});
