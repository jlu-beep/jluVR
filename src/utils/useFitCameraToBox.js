import { Box3, Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

export default function useFitCameraToBox(margin = 1.2) {
  const { camera, controls } = useThree();

  return useCallback((object3d) => {
    if (!object3d) return;
    const box = new Box3().setFromObject(object3d);
    if (!isFinite(box.min.x) || !isFinite(box.max.x)) return;

    const center = box.getCenter(new Vector3());
    const sizeV  = box.getSize(new Vector3());
    const maxDim = Math.max(sizeV.x, sizeV.y, sizeV.z);
    const fov = camera.fov * (Math.PI / 180);
    const fitDist = (maxDim / (2 * Math.tan(fov / 2))) * margin;

    const dir = camera.getWorldDirection(new Vector3()).normalize().multiplyScalar(-1);
    camera.position.copy(center.clone().add(dir.multiplyScalar(fitDist)));
    camera.near = Math.max(0.01, fitDist / 1000);
    camera.far  = Math.max(1000, fitDist * 10);
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  }, [camera, controls]);
}
