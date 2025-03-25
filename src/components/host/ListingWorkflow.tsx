'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = {
  id: string;
  title: string;
  path: string;
  isCompleted: boolean;
};

type ListingWorkflowProps = {
  roomId: string;
  currentStep: string;
};

export default function ListingWorkflow({ roomId, currentStep }: ListingWorkflowProps) {
  const router = useRouter();
  const [steps, setSteps] = useState<Step[]>([
    { id: 'basics', title: 'Basic Info', path: `/become-a-host/${roomId}`, isCompleted: false },
    { id: 'images', title: 'Photos', path: `/become-a-host/images/${roomId}`, isCompleted: false },
    { id: 'pricing', title: 'Pricing', path: `/become-a-host/pricing/${roomId}`, isCompleted: false },
    { id: 'availability', title: 'Availability', path: `/become-a-host/availability/${roomId}`, isCompleted: false },
    { id: 'publish', title: 'Publish', path: `/become-a-host/publish/${roomId}`, isCompleted: false },
  ]);

  useEffect(() => {
    // Mark current step and previous steps as completed
    const updatedSteps = steps.map((step, index) => {
      const currentStepIndex = steps.findIndex(s => s.id === currentStep);
      return {
        ...step,
        isCompleted: index < currentStepIndex || step.id === currentStep
      };
    });
    setSteps(updatedSteps);
  }, [currentStep]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.id === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.isCompleted && step.id !== currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`h-1 w-16 ${
                    steps[index + 1].isCompleted || steps[index + 1].id === currentStep
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <span className="mt-2 text-xs text-center">
              {step.isCompleted ? (
                <Link href={step.path} className="text-blue-600 hover:underline">
                  {step.title}
                </Link>
              ) : (
                <span className={step.id === currentStep ? 'font-medium' : 'text-gray-500'}>
                  {step.title}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}