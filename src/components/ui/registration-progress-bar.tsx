interface RegistrationProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function RegistrationProgressBar({ currentStep, totalSteps, progress }: RegistrationProgressBarProps) {
  return (
    <div className="mb-6">
      {/* Step Counter */}
      <div className="mb-3 text-center">
        <p className="text-sm text-gray-600">
          Шаг {currentStep} из {totalSteps}
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-2 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

