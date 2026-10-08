// features/ipcp/hooks/useIpcpAssessment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { submitMockIpcpAssessment } from '../api/mock-ipcp';
import {
  IPCP_QUESTION_IDS,
  isCompleteAnswers,
  type IpcpAnswer,
  type IpcpAnswers,
  type IpcpQuestionId,
} from '../domain/ipcp-questions';
import { ipcpRoutes } from '../routes';
import { IPCP_LATEST_KEY } from './useIpcpResult';

/** Respuestas de la evaluación IPCP, avance y envío (lleva al resultado). */
export function useIpcpAssessment() {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Partial<IpcpAnswers>>({});
  const submitAssessment = useMutation({ mutationFn: submitMockIpcpAssessment });

  const setAnswer = (id: IpcpQuestionId, value: IpcpAnswer) =>
    setAnswers((previous) => ({ ...previous, [id]: value }));

  const answeredCount = IPCP_QUESTION_IDS.filter((id) => answers[id] !== undefined).length;
  const isComplete = isCompleteAnswers(answers);

  const submit = () => {
    if (!isCompleteAnswers(answers)) return;
    submitAssessment.mutate(answers, {
      onSuccess: (result) => {
        queryClient.setQueryData(IPCP_LATEST_KEY, result);
        // replace: al volver atrás se sale del flujo en vez de regresar al formulario ya enviado
        router.replace(ipcpRoutes.result);
      },
    });
  };

  return {
    answers,
    setAnswer,
    answeredCount,
    total: IPCP_QUESTION_IDS.length,
    isComplete,
    submit,
    isPending: submitAssessment.isPending,
    isError: submitAssessment.isError,
  };
}
