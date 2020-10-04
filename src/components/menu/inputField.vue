<template>
  <div class="input-field">
    <span>{{ message }}</span>
    <input
      v-if="singleInteger"
      v-model="val"
      type="number"
      :min="min"
      :max="max"
      class="input-field__input"
      @click="handleInput"
    />
    <input
      v-else
      v-model="val"
      type="text"
      class="input-field__input"
      @keypress="handleInput"
    />
    <span
      v-if="closeAfterChoice"
      @click="confirm()"
      class="input-field__confirm-button"
      >Ok</span
    >
  </div>
</template>

<script>
import { setOutputChannel } from "../../midi-service/midiService";
export default {
  name: "MidiOut",
  data() {
    return {
      val: null
    };
  },
  props: {
    closeAfterChoice: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ""
    },
    singleInteger: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ""
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    method: {
      type: String,
      default: ""
    }
  },

  methods: {
    setOutputChannel,
    confirm() {
      if (this.val && this.action) {
        this.$store.dispatch(this.action, this.val);
        console.log("this.method", this.method);

        this.$store.dispatch("modalIsOpen", false);
      }
    },
    handleInput(event) {
      let { charCode } = event;
      if ((charCode < 48 || charCode > 57) && charCode !== 0) {
        event.preventDefault();
      }
      if (!this.closeAfterChoice) {
        this[this.method](this.val);
      }
    }
  }
};
</script>

<style lang="scss">
.input-field {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;

  &__input {
    margin: 15px;
  }
  &__confirm-button {
    cursor: pointer;
  }
}
</style>

