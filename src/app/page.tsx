"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="w-full py-20 md:py-32 lg:py-40 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-10 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Система управления банковскими счетами
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Современное решение для эффективного управления банковскими
                счетами физических и юридических лиц
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button size="lg" className="px-8">
                <Link href="auth/login">Войти</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <Link href="auth/login">Регистрация</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12">
            Основные возможности
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Управление клиентами</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Поддержка физических и юридических лиц с полной информацией о
                  клиентах
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>ФИО, дата рождения, адрес для физлиц</li>
                  <li>Наименование, руководитель, бухгалтер для юрлиц</li>
                  <li>Автоматическое обновление статуса "должник"</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Типы банковских счетов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Поддержка всех видов банковских счетов с соблюдением
                  бизнес-правил
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Чековые счета (кредитные/дебитные)</li>
                  <li>Сберегательные счета с начислением процентов</li>
                  <li>Автоматическая генерация номеров счетов</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Финансовые операции</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Полный спектр финансовых операций с автоматическим расчетом
                  комиссий
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Пополнение и снятие средств</li>
                  <li>Межсчетовые переводы</li>
                  <li>Автоматическое начисление процентов</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12">
            Ключевые показатели
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center pt-6">
                <div className="text-4xl font-bold">150+</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Активных клиентов
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center pt-6">
                <div className="text-4xl font-bold">200+</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Банковских счетов
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center pt-6">
                <div className="text-4xl font-bold">98.5%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Удовлетворенность клиентов
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center pt-6">
                <div className="text-4xl font-bold">24/7</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Доступ к системе
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12">
            Как это работает
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  1
                </div>
                <CardTitle>Регистрация клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Простая регистрация клиентов с полной информацией о физических
                  и юридических лицах
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  2
                </div>
                <CardTitle>Управление счетами</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Создание, редактирование и закрытие чековых и сберегательных
                  счетов
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  3
                </div>
                <CardTitle>Финансовые операции</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Выполнение операций с автоматическим расчетом комиссий и
                  начислением процентов
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12">
            Возможности системы
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Учет клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Полный учет физических и юридических лиц с детальной
                  информацией и историей операций
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Управление счетами</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Создание, блокировка и закрытие счетов с соблюдением
                  бизнес-правил
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Финансовые операции</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Пополнение, снятие, переводы с автоматическим расчетом
                  комиссий
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Отчеты</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Генерация отчетов в формате Excel и Word с детализацией по
                  клиентам
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Отслеживание статистики в реальном времени с возможностью
                  экспорта
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Безопасность</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Работа через авторизованные сеансы с ролью кассира
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-lg">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Начните использовать систему уже сегодня
                  </h2>
                  <p className="text-primary-foreground/80">
                    Эффективное управление банковскими счетами с современным
                    интерфейсом и мощным функционалом
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="px-8 hover:scale-105 transition cursor-pointer hover:transition-300"
                  >
                    <Link href="/auth/login">Войти</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="px-8 hover:scale-105 hover:transition cursor-pointer hover:transition-300"
                  >
                    <Link href="auth/login">Регистрация</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="w-full py-8 md:py-12 lg:py-16 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Банковские счета. Все права
                защищены.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Документация
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Условия использования
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Поддержка
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
