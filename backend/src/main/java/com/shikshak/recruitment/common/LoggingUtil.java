package com.shikshak.recruitment.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.experimental.UtilityClass;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility for consistent structured logging across the application.
 * Use {@link #getLogger(Class)} to obtain a logger for any class.
 *
 * <pre>{@code
 * private static final Logger log = LoggingUtil.getLogger(MyService.class);
 * }</pre>
 *
 * For one-off info/debug/error messages, you can also use the static helpers:
 * <pre>{@code
 * LoggingUtil.info(MyService.class, "User {} logged in", userId);
 * }</pre>
 */
@UtilityClass
public class LoggingUtil {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(com.fasterxml.jackson.databind.SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

    /**
     * Returns an SLF4J logger for the given class.
     */
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }

    // ── Convenience static methods ──────────────────────────────────────────

    public static void info(Class<?> clazz, String message, Object... args) {
        LoggerFactory.getLogger(clazz).info(message, args);
    }

    public static void debug(Class<?> clazz, String message, Object... args) {
        LoggerFactory.getLogger(clazz).debug(message, args);
    }

    public static void warn(Class<?> clazz, String message, Object... args) {
        LoggerFactory.getLogger(clazz).warn(message, args);
    }

    public static void error(Class<?> clazz, String message, Object... args) {
        LoggerFactory.getLogger(clazz).error(message, args);
    }

    // ── Structured data logging ─────────────────────────────────────────────

    /**
     * Logs an object as pretty-printed JSON at DEBUG level.
     * Useful for inspecting API responses, DTOs, or entities during development.
     *
     * <pre>{@code
     * LoggingUtil.logData(MyService.class, "Fetched job", jobResponse);
     * }</pre>
     */
    public static void logData(Class<?> clazz, String label, Object data) {
        if (LoggerFactory.getLogger(clazz).isDebugEnabled()) {
            try {
                String json = OBJECT_MAPPER.writerWithDefaultPrettyPrinter()
                        .writeValueAsString(data);
                LoggerFactory.getLogger(clazz).debug("{}:\n{}", label, json);
            } catch (Exception e) {
                LoggerFactory.getLogger(clazz).debug("{}: {} (toString: {})", label, data, e.getMessage());
            }
        }
    }

    /**
     * Logs an object as a single-line JSON at DEBUG level (more compact).
     */
    public static void logDataCompact(Class<?> clazz, String label, Object data) {
        if (LoggerFactory.getLogger(clazz).isDebugEnabled()) {
            try {
                String json = OBJECT_MAPPER.writeValueAsString(data);
                LoggerFactory.getLogger(clazz).debug("{}: {}", label, json);
            } catch (Exception e) {
                LoggerFactory.getLogger(clazz).debug("{}: {}", label, data);
            }
        }
    }

    /**
     * Serialises an arbitrary object to a compact JSON string.
     * Returns the JSON string, or {@code "null"} / error message on failure.
     */
    public static String toJson(Object obj) {
        if (obj == null) return "null";
        try {
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }
}
