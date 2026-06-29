package com.shikshak.recruitment.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * AOP aspect that automatically logs all public methods in {@code @RestController}
 * and {@code @Service} classes — including method arguments, return values,
 * and execution time.
 *
 * <p>Log output appears at DEBUG level, so it is controlled by the
 * {@code logging.level.com.shikshak.recruitment=DEBUG} property already set in
 * {@code application.yml}.
 *
 * <p>To suppress logging on a specific method, annotate it with
 * {@code @SuppressWarnings("unused")} — or simply raise the class's log level.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(com.fasterxml.jackson.databind.SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

    /**
     * Wraps every public method inside classes annotated with {@code @RestController}
     * or {@code @Service}.
     */
    @Around("execution(public * com.shikshak.recruitment.controller..*.*(..))"
            + " || execution(public * com.shikshak.recruitment.service..*.*(..))"
            + " || execution(public * com.shikshak.recruitment.security..*.*(..))")
    public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Class<?> targetClass = joinPoint.getTarget().getClass();
        Logger log = LoggerFactory.getLogger(targetClass);

        String methodName = signature.getMethod().getName();
        Object[] args = joinPoint.getArgs();

        // ── Build a compact string of method arguments ──────────────────────
        String argString = args.length == 0 ? "" : Arrays.stream(args)
                .map(this::serialize)
                .collect(Collectors.joining(", "));

        if (args.length > 0) {
            log.debug("→ {}({})", methodName, argString);
        } else {
            log.debug("→ {}()", methodName);
        }

        long start = System.currentTimeMillis();
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - start;
            log.debug("✗ {}() threw [{}] after {} ms", methodName, e.getClass().getSimpleName(), elapsed);
            throw e;
        }

        long elapsed = System.currentTimeMillis() - start;

        // ── Log return value (trimmed to avoid flooding) ────────────────────
        if (log.isDebugEnabled()) {
            String resultStr = serialize(result);
            if (resultStr.length() > 500) {
                resultStr = resultStr.substring(0, 500) + "... (truncated)";
            }
            log.debug("← {}() = [{}] ({} ms)", methodName, resultStr, elapsed);
        }

        return result;
    }

    private String serialize(Object obj) {
        if (obj == null) return "null";
        try {
            // Try JSON first
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (Exception e) {
            try {
                // Fallback: try the object's own toString()
                String str = obj.toString();
                if (str.length() > 300) {
                    str = str.substring(0, 300) + "...";
                }
                return str;
            } catch (Exception e2) {
                return obj.getClass().getSimpleName() + "@" + Integer.toHexString(System.identityHashCode(obj));
            }
        }
    }
}
