import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPerformanceMonitor } from "@/lib/performance/monitor";

describe("Performance Monitor", () => {
  let monitor;

  beforeEach(() => {
    monitor = createPerformanceMonitor({
      fastOperation: 50,
      slowOperation: 100,
    });
  });

  describe("record", () => {
    it("should record a performance metric", () => {
      monitor.record("testOperation", 100);
      const stats = monitor.getStats("testOperation");

      expect(stats).toBeTruthy();
      expect(stats?.count).toBe(1);
      expect(stats?.avgDuration).toBe(100);
    });

    it("should track multiple operations separately", () => {
      monitor.record("operationA", 100);
      monitor.record("operationB", 200);

      const statsA = monitor.getStats("operationA");
      const statsB = monitor.getStats("operationB");

      expect(statsA?.count).toBe(1);
      expect(statsB?.count).toBe(1);
      expect(statsA?.avgDuration).toBe(100);
      expect(statsB?.avgDuration).toBe(200);
    });

    it("should calculate statistics correctly", () => {
      monitor.record("test", 100);
      monitor.record("test", 200);
      monitor.record("test", 300);

      const stats = monitor.getStats("test");

      expect(stats?.count).toBe(3);
      expect(stats?.avgDuration).toBe(200);
      expect(stats?.minDuration).toBe(100);
      expect(stats?.maxDuration).toBe(300);
    });

    it("should track slow queries", () => {
      monitor.record("slowOperation", 150);
      const slowQueries = monitor.getSlowQueries();

      expect(slowQueries).toHaveLength(1);
      expect(slowQueries[0].name).toBe("slowOperation");
      expect(slowQueries[0].duration).toBe(150);
    });

    it("should not track fast queries as slow", () => {
      monitor.record("fastOperation", 30);
      const slowQueries = monitor.getSlowQueries();

      expect(slowQueries).toHaveLength(0);
    });
  });

  describe("start", () => {
    it("should return a function that records duration", () => {
      const end = monitor.start("timedOperation");
      // Simulate some work
      const startTime = performance.now();
      while (performance.now() - startTime < 10) {
        // Busy wait for at least 10ms
      }
      end();

      const stats = monitor.getStats("timedOperation");
      expect(stats?.count).toBe(1);
      expect(stats?.avgDuration).toBeGreaterThanOrEqual(10);
    });
  });

  describe("timeSync", () => {
    it("should time a synchronous operation", () => {
      const result = monitor.timeSync("syncOp", () => {
        return 42;
      });

      expect(result).toBe(42);
      const stats = monitor.getStats("syncOp");
      expect(stats?.count).toBe(1);
    });

    it("should time a synchronous operation that throws", () => {
      expect(() => {
        monitor.timeSync("throwingOp", () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");

      const stats = monitor.getStats("throwingOp");
      expect(stats?.count).toBe(1);
    });
  });

  describe("time (async)", () => {
    it("should time an async operation", async () => {
      const result = await monitor.time("asyncOp", async () => {
        return 42;
      });

      expect(result).toBe(42);
      const stats = monitor.getStats("asyncOp");
      expect(stats?.count).toBe(1);
    });

    it("should time an async operation that throws", async () => {
      await expect(
        monitor.time("failingAsyncOp", async () => {
          throw new Error("Async error");
        }),
      ).rejects.toThrow("Async error");

      const stats = monitor.getStats("failingAsyncOp");
      expect(stats?.count).toBe(1);
    });
  });

  describe("getStats", () => {
    it("should return null for non-existent operation", () => {
      const stats = monitor.getStats("nonExistent");
      expect(stats).toBeNull();
    });

    it("should calculate percentiles correctly", () => {
      // Record 100 values from 1 to 100
      for (let i = 1; i <= 100; i++) {
        monitor.record("percentileTest", i);
      }

      const stats = monitor.getStats("percentileTest");

      expect(stats?.p50).toBe(50);
      expect(stats?.p95).toBe(95);
      expect(stats?.p99).toBe(99);
    });
  });

  describe("clear", () => {
    it("should clear all metrics", () => {
      monitor.record("op1", 100);
      monitor.record("op2", 200);
      monitor.clear();

      expect(monitor.getStats("op1")).toBeNull();
      expect(monitor.getStats("op2")).toBeNull();
      expect(monitor.getSlowQueries()).toHaveLength(0);
    });

    it("should clear specific operation", () => {
      monitor.record("op1", 100);
      monitor.record("op2", 200);
      monitor.clearOperation("op1");

      expect(monitor.getStats("op1")).toBeNull();
      expect(monitor.getStats("op2")?.count).toBe(1);
    });
  });

  describe("getSummary", () => {
    it("should return complete summary", () => {
      monitor.record("op1", 100);
      monitor.record("op2", 200);

      const summary = monitor.getSummary();

      expect(summary.totalOperations).toBe(2);
      expect(summary.operations).toHaveProperty("op1");
      expect(summary.operations).toHaveProperty("op2");
    });

    it("should include slow queries in summary", () => {
      monitor.record("slowOperation", 150);

      const summary = monitor.getSummary();

      expect(summary.totalSlowQueries).toBe(1);
      expect(summary.slowQueries).toHaveLength(1);
    });
  });
});
