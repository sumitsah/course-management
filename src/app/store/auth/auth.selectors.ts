import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";
import { AUTH_FEATURE_KEY } from "./auth.constants";

// Feature Selector
export const selectAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

// Basic Selectors
export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectToken = createSelector(selectAuthState, (state) => state.token);

export const selectLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectError = createSelector(selectAuthState, (state) => state.error);

// Derived Selector
export const isLoggedIn = createSelector(selectToken, (token) => !!token);