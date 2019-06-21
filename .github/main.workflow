workflow "New workflow" {
  on = "push"
  resolves = ["Annotated Jest"]
}

action "Annotated Jest" {
  uses = "rkusa/jest-action@1.0.0"
}
