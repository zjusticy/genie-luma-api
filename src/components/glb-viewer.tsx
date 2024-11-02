import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Loader } from 'lucide-react';

// Type for GLB model props
interface ModelProps {
  url: string;
}

// Type for main component props
interface GLBViewerProps {
  modelUrl: string;
}

// Type for error message component props
interface ErrorMessageProps {
  message: string;
}

// Type for error boundary props and state
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <Loader className="w-8 h-8 text-white animate-spin" />
  </div>
);

const Model: React.FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-red-500 bg-opacity-75 text-white p-4 rounded-lg">
      {message}
    </div>
  </div>
);

const GLBViewer: React.FC<GLBViewerProps> = ({
  modelUrl,
}: {
  modelUrl: string;
}) => {
  const [error, setError] = useState<string | null>(null);
  console.log(modelUrl);
  return (
    <div className="w-full h-96 bg-gray-400 rounded-lg">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <ErrorBoundary onError={(e) => setError(e)}>
            <Model url={modelUrl} />
          </ErrorBoundary>
        </Suspense>
        <OrbitControls />
      </Canvas>

      <Suspense fallback={<LoadingSpinner />}>
        <></>
      </Suspense>

      {error && <ErrorMessage message={`Failed to load model: ${error}`} />}
    </div>
  );
};

// Error boundary component for catching 3D model loading errors
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    this.props.onError(error.message);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default GLBViewer;
