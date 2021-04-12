import {createApp} from 'vue';
import * as Diurnal from '@pablo-mayrgundter/diurnal.js';
import Logo from '../logo/Logo.vue';


// TODO(https://github.com/buildrs/xyz/issues/1): CSS loading is weird.
import css from '../../public/index.css';


Diurnal.bind();

const app = createApp({
  components: {
    'logo': Logo
  },
});

app.mount('#app');

