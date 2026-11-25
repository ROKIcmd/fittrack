import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import AuthButtons from "../components/AuthButton";
import Button from "../components/Button";
import FeatureStrip from "../components/FeaturStrip";
import MembershipTiers from "../components/MembershipTier";
import { features } from "../components/Features";
import { tiers } from "../components/Membership";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black pb-12 font-body text-white">
      <Hero>
        <Navbar>
          <AuthButtons />
        </Navbar>

        <div className="max-w-3xl px-5 pt-16 md:px-20 md:pt-28">
          <h1 className="font-display text-4xl leading-tight md:text-[52px]">
            Your Fitness Journey,
            <br />
            <span className="text-blue-500">SMARTER.</span>
          </h1>
          <p className="mt-5 max-w-sm text-2xl leading-snug md:text-3xl">
            Track your workouts, manage your membership, and reach your fitness goals - all in one place.
          </p>
          <Button to="/register" size="lg" className="mt-8 md:ml-18">
            Get Started
          </Button>
        </div>
      </Hero>

      <FeatureStrip features={features} className="-mt-14" />
      <MembershipTiers tiers={tiers} className="mt-12" />
    </div>
  );
}
