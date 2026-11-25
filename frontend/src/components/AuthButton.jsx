import Button from "./Button";

export default function AuthButtons() {
  return (
    <>
      <Button to="/login" variant="outline">Log In</Button>
      <Button to="/register">Sign Up</Button>
    </>
  );
}
