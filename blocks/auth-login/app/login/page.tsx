import { LoginForm } from "@/components/login-form"
import Grainient from "@/components/Grainient"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 overflow-hidden">
      {/* Background Grainient */}
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#1a1033"
          color2="#0a0514"
          color3="#3b1a7d"
          timeSpeed={0.05}
          grainAmount={0.05}
          warpStrength={0.5}
          zoom={1.2}
          className="opacity-50"
        />
      </div>

      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
