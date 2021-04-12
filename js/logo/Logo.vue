<template>
  Hello Logo!
  <div id="view"></div>
</template>
<script>
import * as Vue from 'vue';
import loadLogo from './logo.js';


export default {
  setup() {
    //console.log('loading logo...');
    loadLogo(document.querySelector('#view'));
    //console.log('loading logo...done.');
  },
  data() {
    return {
    };
  }
}
</script>
