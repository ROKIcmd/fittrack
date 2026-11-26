import LinkButton from "./LinkButton";

export default function AuthButtons() {
  return (
    <>
      <LinkButton to="/login" variant="outline">Log In</LinkButton>
      <LinkButton to="/register">Sign Up</LinkButton>
    </>
  );
}