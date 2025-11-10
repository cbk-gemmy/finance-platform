// .env.local 파일에서 환경 변수(DATABASE_URL 등)를 불러오기 위해 dotenv 모듈 사용
import { config } from "dotenv";

// Neon serverless PostgreSQL 클라이언트를 불러옴
import { neon } from "@neondatabase/serverless";

// Drizzle ORM의 Neon HTTP 드라이버를 불러옴 (SQL 실행용)
import { drizzle } from "drizzle-orm/neon-http";

// Drizzle ORM의 마이그레이션 유틸리티를 불러옴
import { migrate } from "drizzle-orm/neon-http/migrator";

// .env.local 파일의 환경 변수를 현재 실행 환경(process.env)에 주입
config({ path: ".env.local" });

// Neon 데이터베이스 연결 인스턴스 생성
// DATABASE_URL은 .env.local에 정의되어 있어야 함
const sql = neon(process.env.DATABASE_URL!);

// drizzle()을 이용해 ORM 데이터베이스 객체 생성
// 이후 db를 통해 쿼리나 마이그레이션 작업을 수행할 수 있음
const db = drizzle(sql);

// 비동기 함수 main 정의 (마이그레이션 실행 담당)
const main = async () => {
  try {
    // drizzle 폴더에 있는 마이그레이션 파일을 실행
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (error) {
    // 마이그레이션 중 오류 발생 시 콘솔에 출력하고 프로세스 종료
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

// main() 함수를 호출하여 실제 마이그레이션 실행
main();
