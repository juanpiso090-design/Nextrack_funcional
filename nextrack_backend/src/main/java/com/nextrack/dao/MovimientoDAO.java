package com.nextrack.dao;

import com.nextrack.model.Movimiento;
import com.nextrack.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class MovimientoDAO {

    public void registrarMovimiento(Movimiento movimiento) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            session.persist(movimiento);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }
    }
}