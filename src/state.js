import { ref, reactive } from "vue";

const state = reactive({
  inputValue: "",
});

function setInputValue(value) {
  state.inputValue = value;
}

export default function useGlobalState() {
  return { state, setInputValue };
}
