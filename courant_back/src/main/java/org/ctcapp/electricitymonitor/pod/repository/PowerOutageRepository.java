package org.ctcapp.electricitymonitor.pod.repository;

import org.ctcapp.electricitymonitor.pod.model.PowerOutage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PowerOutageRepository extends JpaRepository<PowerOutage, Long> {

}