import React, { Suspense } from "react";
import ErrorFallback from "../ErrorFallback/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { routes } from "../../routes.js";
import Header from "../Header/Header.jsx";
import { Container } from "@mui/material";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Header />
        <Suspense fallback="loading...">
          <Container className="flex-grow py-4">
            <Routes>
              {routes.map((item) => (
                <Route
                  key={item.path}
                  element={item.element}
                  path={item.path}
                />
              ))}
              <Route
                path="*"
                element={
                  <div>
                    <h4 className="text-2xl font-bold text-center text-red-500">
                      404: No route found.
                    </h4>
                  </div>
                }
              />
            </Routes>
          </Container>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default RootLayout;
